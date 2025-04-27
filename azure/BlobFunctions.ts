export async function viewBlobs(): Promise<string[]> {
    console.log("Calling blobs.list");
    const blobs: string[] = await Meteor.callAsync("blobs.list", null)
    return blobs;
}