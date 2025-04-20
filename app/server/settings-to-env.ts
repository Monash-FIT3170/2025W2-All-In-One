console.log("Mapping Meteor ENV to Process ENV");
if (Meteor.isServer && Meteor.settings?.private) {
    for (const [key, value] of Object.entries(Meteor.settings.private)) {
      if (typeof value === "string" && !process.env[key]) {
        process.env[key] = value;
      }
    }
  }
console.log("Done");
