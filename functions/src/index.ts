import * as functions from "firebase-functions";
const admin = require("firebase-admin");

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

// // https://firebase.google.com/docs/firestore/extend-with-functions
// export const countNameChangesForStudents = functions.firestore
//   .document("students/{userId}")
//   .onUpdate((change, context) => {
//     // Retrieve the current and previous value
//     const data = change.after.data();
//     const previousData = change.before.data();
//     functions.logger.info("Hello logs!", { structuredData: true });

//     // We'll only update if the name has changed.
//     // This is crucial to prevent infinite loops.
//     if (data.firstName == previousData.firstName) {
//       console.log("name is same as previous");
//       return null;
//     }

//     // Retrieve the current count of name changes
//     let count = data.firstName_change_count;
//     if (!count) {
//       count = 0;
//     }

//     console.log("updating count");
//     // Then return a promise of a set operation to update the count
//     return change.after.ref.set(
//       {
//         firstName_change_count: count + 1,
//       },
//       { merge: true }
//     );
//   });

const documentHasChanged = (document: string) =>
  functions.firestore.document(document).onUpdate((change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();

    if (data.modifiedAt == previousData.modifiedAt) {
      return change.after.ref.set(
        {
          modifiedAt: context.timestamp,
        },
        { merge: true }
      );
    } else {
      return "";
    }
  });

export const classHasChanged = documentHasChanged("classes/{classID}");
export const studentHasChanged = documentHasChanged("students/{userId}");

admin.initializeApp({
  apiKey: "AIzaSyCwxiDrVBzpiEtz5rL9eJt6bZIdymyTQ30",
  authDomain: "ga-comments.firebaseapp.com",
  projectId: "ga-comments",
  storageBucket: "ga-comments.appspot.com",
  messagingSenderId: "671616870740",
  appId: "1:671616870740:web:74456365bd146415e180c1",
  measurementId: "G-MMQSJ4ES92",
});

export const seedReportTypes = functions.https.onRequest(
  async (request, response) => {
    // const src = ["Interim 1", "Interim A", "Interim 2", "Interim B"];
    const batch = admin.firestore().batch();

    const interim1 = admin.firestore().collection("reportTypes").doc();

    batch.set(
      interim1,
      {
        name: "Test 1",
        groupType: "CLASS",
      },
      { merge: true }
    );

    await batch.commit();
    // admin.firestore().collection("reportTypes").add({
    //   name: "Test 1",
    //   groupType: "CLASS",
    // });
    // admin.firestore().collection("reportTypes").add({
    //   name: "Test A",
    //   groupType: "CLASS",
    // });
    // admin.firestore().collection("reportTypes").add({
    //   name: "Test 2",
    //   groupType: "CLASS",
    // });
    // admin.firestore().collection("reportTypes").add({
    //   name: "Test B",
    //   groupType: "CLASS",
    // });
    functions.logger.info("Seeding Data...", { structuredData: true });
    response.send("Seed Sucessful!");
  }
);

// export const onStudentChange = functions.firestore
//   .document("students/{userId}")
//   .onUpdate((change, context) => {
//     // Retrieve the current and previous value
//     functions.logger.info("Updating Student", { structuredData: true });
//     functions.logger.info(`Updating Student ${context.timestamp}`, {
//       structuredData: true,
//     });

//     const previousData = change.before.data();

//     // We'll only update if the modifiedDate has changed.
//     // This is crucial to prevent infinite loops.
//     if (
//       previousData.modifiedAt != undefined &&
//       previousData.modifiedAt == context.timestamp
//     ) {
//       return null;
//     }

//     // Then return a promise of a set operation to update the count
//     return change.after.ref.set(
//       {
//         modifiedAt: context.timestamp,
//       },
//       { merge: true }
//     );
//   });

// export const getAllStudents = functions.https.onRequest(
//   async (request, response) => {
//     // await firestore.collection("students").doc().set({ firstName: "grogo" });
//     // console.log(request.params);
//     // var studentsRef = firestore.collection("students");
//     // let snapshot = await studentsRef.get();
//     // response.send(snapshot.docs.map((doc) => doc.data()));
//   }
// );
