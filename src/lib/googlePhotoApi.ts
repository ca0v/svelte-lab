import { signin } from "@googlePhoto/googleApi";

const GOOGLE_PHOTO_PAGE_SIZE = 25;

export async function listAllAlbums() {
    let { albums, nextPageToken } = await listAlbums();
    albums = albums || [];
    while (nextPageToken) {
        const moreAlbums = await listAlbums(nextPageToken);
        if (moreAlbums.albums) {
            albums.splice(albums.length, 0, ...moreAlbums.albums);
        }
        nextPageToken = moreAlbums.nextPageToken;
    }
    return albums;
}

export async function listAlbums(pageToken?: string) {
    const response = await gapi.client.photoslibrary.albums.list({
        pageToken
    })
    return response.result
}

export async function loadAlbum(albumId: string) {
    const response = await gapi.client.photoslibrary.albums.get({
        albumId,
    })
    return response.result
}

export async function loadMediaItem(mediaItemId: string) {
    const response = await gapi.client.photoslibrary.mediaItems.get({
        mediaItemId,
    })
    return response.result
}

export async function loadPhotos(startDate: gapi.client.photoslibrary.Date, endDate: gapi.client.photoslibrary.Date, pageToken?: string) {
    const response = await gapi.client.photoslibrary.mediaItems.search({
        resource: {
            // @ts-ignore
            orderBy: "MediaMetadata.creation_time",
            pageSize: GOOGLE_PHOTO_PAGE_SIZE,
            pageToken: pageToken,
            filters: {
                dateFilter: {
                    ranges: [
                        {
                            startDate,
                            endDate
                        }
                    ]
                }
            }
        },
    })
    if (response.status === 200) {
        return response.result;
    }
    throw response.statusText;
}


export async function* loadAllPhotos(startDate: gapi.client.photoslibrary.Date, endDate: gapi.client.photoslibrary.Date, pageToken?: string)
    : AsyncGenerator<Array<gapi.client.photoslibrary.MediaItem>, void, void> {
    while (true) {
        const response = await loadPhotos(startDate, endDate, pageToken);
        if (response.mediaItems) {
            yield response.mediaItems;
        }
        pageToken = response.nextPageToken
        if (!pageToken) break;
    }
}

export async function* loadAllPhotosByIds(ids: Array<string>) {
    const idsToLoad = [...ids];
    while (idsToLoad.length > 0) {
        const mediaItemIds = idsToLoad.splice(0, 50);
        const response = await gapi.client.photoslibrary.mediaItems.batchGet({
            mediaItemIds,
        })
        if (response.status === 200) {
            yield response.result.mediaItemResults;
        }
    }
}

async function loadPhotosByAlbum(albumId: string, pageToken?: string) {
    return await gapi.client.photoslibrary.mediaItems.search({
        resource: {
            albumId,
            pageSize: GOOGLE_PHOTO_PAGE_SIZE,
            pageToken,
        },
    })
}

export async function loadAllPhotosByAlbum(albumId: string, pageToken?: string) {
    const response = await loadPhotosByAlbum(albumId, pageToken);
    if (response.status !== 200) {
        throw new Error("Error loading photos")
    }
    let { mediaItems, nextPageToken } = response.result;
    mediaItems = mediaItems || [];
    while (nextPageToken) {
        const morePhotos = await loadPhotosByAlbum(albumId, nextPageToken);
        if (morePhotos.status !== 200) {
            throw new Error("Error loading photos")
        }
        if (morePhotos.result.mediaItems) {
            mediaItems.splice(mediaItems.length, 0, ...morePhotos.result.mediaItems);
        }
        nextPageToken = morePhotos.result.nextPageToken;
    }
    return mediaItems;
}

async function loadPhotosByDate(dates: Array<{ year: number, month: number, day: number }>, pageToken?: string) {
    await signin();
    return await gapi.client.photoslibrary.mediaItems.search({
        resource: {
            //albumId,
            pageSize: GOOGLE_PHOTO_PAGE_SIZE,
            pageToken,
            filters: {
                mediaTypeFilter: {
                    mediaTypes: ["PHOTO"],
                },
                dateFilter: {
                    dates
                }
            },
        },
    })
}

export async function loadAllPhotosByDate(dates: Array<{ year: number, month: number, day: number }>, pageToken?: string) {
    const response = await loadPhotosByDate(dates, pageToken);
    if (response.status !== 200) {
        throw new Error("Error loading photos")
    }
    let { mediaItems, nextPageToken } = response.result;
    mediaItems = mediaItems || [];
    while (nextPageToken) {
        const morePhotos = await loadPhotosByDate(dates, nextPageToken);
        if (morePhotos.status !== 200) {
            throw new Error("Error loading photos")
        }
        if (morePhotos.result.mediaItems) {
            mediaItems.splice(mediaItems.length, 0, ...morePhotos.result.mediaItems);
        }
        nextPageToken = morePhotos.result.nextPageToken;
    }
    return mediaItems;
}

