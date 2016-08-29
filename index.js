'use strict';

const rp = require('request-promise');

class MusicProvider {
    completeMissing(asset, url) {
        const URI_BEGINNING = 'http://img.youtube.com/vi/';
        const TIME_OUT = 500;
        if (!asset.sourceIconUrl) {
            asset.sourceIconUrl = `${url}/provider/asset/${provider.name}/false/source`;
        }
        if (!asset.sourceInvertedIconUrl) {
            asset.sourceInvertedIconUrl = `${url}/provider/asset/${provider.name}/true/source`;
        }
        if (!asset.classIconUrl) {
            asset.classIconUrl = `${url}/provider/asset/${provider.name}/false/icon`;
        }
        if (!asset.classInvertedIconUrl) {
            asset.classInvertedIconUrl = `${url}/provider/asset/${provider.name}/true/icon`;
        }
        if (!asset.backgroundImageUrl) {
            let youtubeId = asset.url.substr(asset.url.length - 11);

            let url = `${URI_BEGINNING}${youtubeId}/maxresdefault.jpg`;

            return rp.get({
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
        }
        return Promise.resolve(asset);
    }
}

module.exports = MusicProvider;