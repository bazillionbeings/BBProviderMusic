'use strict';

const rp = require('request-promise'),
    youtubeKey = require('./config.json').youtubeKey,
    providerName = require('./package.json').name;

class MusicProvider {
    completeMissing(asset, url) {
        const URI_BEGINNING = 'http://img.youtube.com/vi/';
        const TIME_OUT = 500;
        if (!asset.sourceIconUrl) {
            asset.sourceIconUrl = `${url}/provider/asset/${providerName}/false/source`;
        }
        if (!asset.sourceInvertedIconUrl) {
            asset.sourceInvertedIconUrl = `${url}/provider/asset/${providerName}/true/source`;
        }
        if (!asset.classIconUrl) {
            asset.classIconUrl = `${url}/provider/asset/${providerName}/false/icon`;
        }
        if (!asset.classInvertedIconUrl) {
            asset.classInvertedIconUrl = `${url}/provider/asset/${providerName}/true/icon`;
        }

        let youtubeId = asset.url.substr(asset.url.length - 11);
        let promises = [];
        if (!asset.attributes.name) {
            let p = rp.get({url: `https://www.googleapis.com/youtube/v3/videos?part=id%2Csnippet&id=${youtubeId}&key=${youtubeKey}`}).then(result => {
                asset.attributes.name = result.items[0].snippet.title;
            });
            promises.push(p);
        }

        if (!asset.backgroundImageUrl) {
            let url = `${URI_BEGINNING}${youtubeId}/maxresdefault.jpg`;

            let p = rp.get({
                url
            }).then(() => {
                asset.backgroundImageUrl = url;
            }).catch(err => {
                if (err.statusCode === 404) {
                    url = `${URI_BEGINNING}${youtubeId}/hqdefault.jpg`;
                    return rp.get({
                        url,
                        timeout: TIME_OUT
                    }).then(() => {
                        asset.backgroundImageUrl = url;
                    }).catch(err => {
                        if (err.statusCode === 404) {
                            url = `${URI_BEGINNING}${youtubeId}/mqdefault.jpg`;
                            return rp.get({
                                url,
                                timeout: TIME_OUT
                            }).then(() => {
                                asset.backgroundImageUrl = url;
                            }).catch(err => {
                                if (err.statusCode === 404) {
                                    url = `${URI_BEGINNING}${youtubeId}/sddefault.jpg`;
                                    return rp.get({
                                        url,
                                        timeout: TIME_OUT
                                    }).then(() => {
                                        asset.backgroundImageUrl = url;
                                    }).catch(err => {
                                        asset.backgroundImageUrl = null;
                                    });
                                } else {
                                    throw err;
                                }
                            });
                        } else {
                            throw err;
                        }
                    });
                } else {
                    throw err;
                }
            }).catch(console.error);

            promises.push(p);
        }

        return Promise.all(promises).then(() => asset);
    }
}

module.exports = MusicProvider;