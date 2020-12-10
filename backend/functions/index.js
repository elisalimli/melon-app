const app = require("express")();
const functions = require("firebase-functions");
const cors = require("cors");
app.use(cors());

const FBAuth = require("./util/FBAuth");
const {
  getAllScreams,
  postOneScream,
  postImageScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream,
} = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationRead,
  setLastSeenAt,
  getAllUsers,
} = require("./handlers/users");
const { db } = require("./util/admin");

//Scream  routes
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, postOneScream);
app.post("/scream/:screamId/image", FBAuth, postImageScream);
app.get("/scream/:screamId", getScream);
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);
app.get("/scream/:screamId/like", FBAuth, likeScream);
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);
app.delete("/scream/:screamId", FBAuth, deleteScream);

//Registiration  routes
app.post("/signup", signup);
app.post("/login", login);
app.get("/user", FBAuth, getAuthenticatedUser);
//About user
app.get("/users", FBAuth, getAllUsers);
app.post("/user", FBAuth, addUserDetails);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user/status", FBAuth, setLastSeenAt);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationRead);

exports.api = functions.region("europe-west1").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          snapshot.data().userHandle !== doc.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => console.error(err));
  });

exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          snapshot.data().userHandle !== doc.data().userHandle
        ) {
          console.log(snapshot.data().userHandle, doc.data().userHandle);
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => console.error(err));
  });

exports.deleteNotificationOnUnlike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => console.error(err));
  });

exports.onUserImageChange = functions
  .region("europe-west1")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    const batch = db.batch();
    if (change.before.data().imageURL !== change.after.data().imageURL) {
      return db
        .collection("screams")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageURL });
          });
          return batch.commit();
        });
    }
  });

exports.onScreamDelete = functions
  .region("europe-west1")
  .firestore.document("/screams/{screamId}")
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("screamId", "==", screamId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("screamId", "==", screamId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("screamId", "==", screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => {
        console.error(err);
      });
  });
