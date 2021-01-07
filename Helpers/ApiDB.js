import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import functions from '@react-native-firebase/functions';

var db;
var userId;
export function init() {
  db = database()
  userId = auth().currentUser.uid
console.log("db initialisé avec uid = "+userId)

}

export async function Add(result) {
  id = await getNextId()
  result.id = id;
  result.hidden = false
  await db.ref(userId+'/pdf/' + id).set(result);
  return id;
}
export async function Update(result) {
  var lastresult = [];
  for (var prop in result) {
    //console.log("prop => " + prop + " est egale a =>" + result[prop])
    if (result[prop] != undefined) {
      lastresult[prop] = result[prop]
    }

  }
  /*console.log(" ")
  console.log("Last resule === ")
  console.log(" ")*/

  console.log("update call id =" + lastresult.id)
  await db.ref(userId+'/pdf/' + lastresult.id).set(lastresult);
  console.log('update at ' + lastresult.id)
  //return lastresult.id;
}
export async function Delete(id) {
  console.log("delete call id =" + id)
  await db.ref(userId+'/pdf/' + id).update({ hidden: true });
  console.log('delete at ' + id)
  //return result.id;
}
export async function getAllBon() {
  var list = await db.ref().child(userId+"/pdf").orderByChild("hidden").equalTo(false).once('value')
  var result = JSON.parse(JSON.stringify(list))
  return result;
}

export async function getNextId() {
  var id = 0
  var result = await getAllBon()
  var x = 0
  while (!!result && !!result[x]) {
    x++;
  }
  return x
}
export async function sendMail(id,b64) {
  var sendMailtoFunction = functions().httpsCallable('sendMail')

  sendMailtoFunction(
      {
        id:id,
        mail:auth().currentUser.email.toString(),
        base64:b64
      }
    )

}

export async function getById(id) {

  var list = await getAllBon()

  try {
    return result[id];
  } catch (e) {
    //console.log("erreur getById id introuvable")
    return null
  }
}

export function dbName() {
  return db
}
