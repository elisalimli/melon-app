const { admin, db } = require("../util/admin");
const config = require("../util/config");
const {
  validateSignUpData,
  validateLoginData,
  reduceUserDetails,
} = require("../util/validates");
const firebase = require("firebase");

firebase.initializeApp(config);
//--------------------------------------------------------------------
//Sign up
exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  //Validate data
  let token, userId;
  const { valid, errors } = validateSignUpData(newUser);
  if (!valid) return res.status(400).json(errors);

  const noImg = "no-img.png";

  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return status(400).json({ handle: "this handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;

      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        imageURL: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        createdAt: new Date().toISOString(),
        userId,
      };

      db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Something went wrong,please try again." });
    });
};

//--------------------------------------------------------------------
//Login
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-email" ||
        err.code === "auth/user-not-found"
      ) {
        return res
          .status(403)
          .json({ general: "Wrong credentials,please try again." });
      } else {
        res.status(500).json({ error: err.code });
      }
    });
};
//--------------------------------------------------------------------
//Upload profile image
exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });
  let imageFileName;
  let imageToBeUploaded = {};

  console.log(req.body);
  busboy.on("file", (fieldName, file, fileName, encoding, mimetype) => {
    if (mimetype !== "image/png" && mimetype !== "image/jpeg") {
      return res.status(400).json({ error: "Wrong type file submitted" });
    }
    const imageExtension = fileName.split(".")[fileName.split(".").length - 1];
    imageFileName = `${Math.round(
      Math.random() * 100000000000000
    )}.${imageExtension}`;
    const filePath = path.join(os.tmpdir(), imageFileName);

    imageToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageURL = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({ imageURL });
      })
      .then(() => {
        return res.json({ message: "Image uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });

  busboy.end(req.rawBody);
};

//--------------------------------------------------------------------
//Add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details added successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
//--------------------------------------------------------------------
//Get own user details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.credentials = doc.data();
        return db
          .collection("likes")
          .where("userHandle", "==", req.user.handle)
          .get();
      }
    })
    .then((data) => {
      userData.likes = [];
      data.forEach((doc) => {
        userData.likes.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then((data) => {
      userData.notifications = [];
      data.forEach((doc) => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          screamId: doc.data().screamId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id,
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//Get any user's details
exports.getUserDetails = (req, res) => {
  let userData = {};
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        userData.user = doc.data();
        return db
          .collection("screams")
          .where("userHandle", "==", req.params.handle)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        return res.status(404).json({ error: "User not found" });
      }
    })
    .then((data) => {
      userData.screams = [];
      data.forEach((doc) => {
        const {
          body,
          userHandle,
          postImageURL,
          userImage,
          createdAt,
          likeCount,
          commentCount,
        } = doc.data();
        userData.screams.push({
          body,
          userHandle,
          postImageURL,
          userImage,
          createdAt,
          likeCount,
          commentCount,
          screamId: doc.id,
        });
      });
      return res.json(userData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
//Set user status
exports.setLastSeenAt = (req, res) => {
  //Set user last seen at
  db.doc(`/users/${req.user.handle}`).update({ lastSeenAt: Date.now() });
  //Set owner of last seen at

  const batch = db.batch();

  const screams = db
    .collection("/screams")
    .where("userHandle", "==", req.user.handle)
    .get()
    .then((data) => {
      data.forEach((doc) => {
        console.log(doc.data());
        const scream = db.doc(`/screams/${doc.id}`);
        batch.update(scream, { lastSeenAt: Date.now() });
      });
      return batch.commit();
    });

  return res.status(200).json({ message: "User last seen at changed" });
};

exports.markNotificationRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach((notificationId) => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: "Notifications marked read" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.getAllUsers = async (req, res) => {
  const users = [];
  const data = await db.collection("users").get();
  data.forEach((doc) => {
    user.push(doc.data().handle);
  });
  return res.json({ users });
};
