import { MongoClient } from 'mongodb';
import { isDocumentValid } from '../utilities';

// READ_ALL
export const getAll = async (uri, collectionName) => {
  const client = await MongoClient.connect(uri);
  const db = client.db();

  const dbCollection = db.collection(collectionName);

  const response = await dbCollection.find().toArray();

  console.log(response); // remove before production

  client.close();

  return response;
};

// READ_ONE
export const getOne = async (uri, collectionName, query) => {
  // query is an object consisting of one or more key-value pairs, e.g { age:25, name:"John Doe" }

  const client = await MongoClient.connect(uri);
  const db = client.db();

  const dbCollection = db.collection(collectionName);

  const response = await dbCollection.findOne(query);

  console.log(response); // remove before production

  client.close();

  return response;
};

// READ_MANY
export const getMany = async (uri, collectionName, query) => {
  // query is an object consisting of one or more key-value pairs, e.g { age:25, name:"John Doe" }

  const client = await MongoClient.connect(uri);
  const db = client.db();

  const dbCollection = db.collection(collectionName);

  const response = await dbCollection.find(query).toArray();

  console.log(response); // remove before production

  client.close();

  return response;
};

// CREATE_ONE
export const postOne = async (uri, collectionName, req, requiredValues) => {
  const data = req.body;
  if (!isDocumentValid(data, requiredValues))
    return console.log('Some missing fields in request body');

  const client = await MongoClient.connect(uri);
  const db = client.db();

  const dbCollection = db.collection(collectionName);

  dbCollection
    .insertOne(data)
    .then(() => console.log('Added document successfully'))
    .catch(err => console.log(err));

  client.close();
};

// CREATE_MANY
export const postMany = async (uri, collectionName, req, requiredValues) => {
  const { objects } = req.body; // objects is an array
  const objectsLength = objects.length;

  for (let i = 0; i < objectsLength; i++) {
    if (!isDocumentValid(objects[i], requiredValues))
      return console.log('Some missing fields in request body of some documents');
  }

  const client = await MongoClient.connect(uri);
  const db = client.db();

  const dbCollection = db.collection(collectionName);

  dbCollection
    .insertMany(objects)
    .then(() => console.log('Added documents successfully'))
    .catch(err => console.log(err));

  client.close();
};

// UPDATE_ONE
export const updateOne = async (uri, collectionName, req, query, requiredValues) => {
  const data = req.body;
  if (!isDocumentValid(data, requiredValues))
    return console.log('Some missing fields in request body');

  const client = await MongoClient.connect(uri);
  const db = client.db();

  const dbCollection = db.collection(collectionName);

  dbCollection
    .updateOne(query, { ...data, _id: data._id })
    .then(() => console.log('Updated document successfully'))
    .catch(err => console.log(err));

  client.close();
};

// UPDATE_MANY
//  export const updateMany = async (uri, collectionName, req, query) => {
//   /*
//     query is an object consisting of one or more key-value pairs, e.g { age:25, name:"John Doe" }

//     Only use this api when you are sure of the exact fields of multiple documents you wish to
//     change (at once) based on your query
//   */

//   const client = await MongoClient.connect(uri);
//   const db = client.db();

//   const dbCollection = db.collection(collectionName);

//   dbCollection
//     .updateMany(query, req.body)
//     .then(() => console.log(`Updated documents successfully`))
//     .catch(err => console.log(err));

//   client.close();
// };

// DELETE_ONE
export const deleteOne = async (uri, collectionName, query) => {
  const client = await MongoClient.connect(uri);
  const db = client.db();

  const dbCollection = db.collection(collectionName);

  dbCollection
    .deleteOne(query)
    .then(() => console.log('Deleted document successfully'))
    .catch(err => console.log(err));

  client.close();
};

// DELETE_MANY
export const deleteMany = async (uri, collectionName, query) => {
  /*
    query is an object consisting of one or more key-value pairs, e.g { age:25, name:"John Doe" }

    Only use this api when you are sure of the exact fields of multiple documents you wish to
    delete (at once) based on your query
  */

  const client = await MongoClient.connect(uri);
  const db = client.db();

  const dbCollection = db.collection(collectionName);

  dbCollection
    .deleteMany(query)
    .then(() => console.log('Deleted documents successfully'))
    .catch(err => console.log(err));

  client.close();
};
