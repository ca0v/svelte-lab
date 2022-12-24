async function* loadAllPhotos(startDate: gapi.client.photoslibrary.Date, endDate: gapi.client.photoslibrary.Date, pageToken?: string) {
    const result: Array<gapi.client.photoslibrary.MediaItem> = [
        {
            id: "1",
            baseUrl: "https://picsum.photos/200/300",
            filename: "test.jpg",
            mediaMetadata: {
                creationTime: "2021-01-01",
                height: "300",
                width: "200",
            }
        }
    ]
    yield result;
}

async function* loadAllPhotosByIds(ids: Array<string>) {
    for (const id of ids) {
        const result: gapi.client.photoslibrary.MediaItemResult[] = [{
            mediaItem: {
                id,
                baseUrl: "https://picsum.photos/200/300",
                filename: "test.jpg",
                mediaMetadata: {
                    creationTime: "2021-01-01",
                    height: "300",
                    width: "200",
                }
            }
        }];

        yield result;
    }
}

async function loadMediaItem(mediaItemId: string) {
    const result: gapi.client.photoslibrary.MediaItem = {
        id: mediaItemId,
        baseUrl: "https://picsum.photos/200/300",
        filename: "test.jpg",
        mediaMetadata: {
            creationTime: "2021-01-01",
            height: "300",
            width: "200",
        }
    }
    return result;
}

export { loadAllPhotos, loadAllPhotosByIds, loadMediaItem }
