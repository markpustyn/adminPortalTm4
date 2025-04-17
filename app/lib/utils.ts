export async function convert(blobUrl: string) {
    const response = await fetch(blobUrl)
    const blob = await response.blob()
    const fileName = Math.random().toString(36).slice(2, 9)
    const type = blob.type || "application/octet-stream"
    const file = new File([blob], `${fileName}.${type.split("/")[1]}`,
    {
        type: type
    })
    return file;
}