import { Client, Databases, ID, Query } from 'appwrite'

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

//ACCESS to appawrite functionnalities
//Client : vient de appwrite
const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)

//quel functionnalities je souhaites utiliser from appwrite
//je souhaite utilise la functionnality database
//Databases : vient de appwrite
const database = new Databases(client);

//grace au mot clé export je peux l'utiliser dans d'autres fichiers
export const updateSearchCount = async (searchTerm, movie) => {
  // 1. Use Appwrite SDK to check if the search term exists in the database
 try {
  //use DATABASE_ID;
  //select from COLLECTION_ID
  //where searchTerm egal 'searchTerm'
  //Query : vient de appwrite
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal('searchTerm', searchTerm),
  ])

  // 2. If it does, update the count
  if(result.documents.length > 0) {
   const doc = result.documents[0];

   //UPDATE
   //set count = count +1 where doc = id
   await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
    count: doc.count + 1,
   })
  // 3. If it doesn't, create a new document with the search term and count as 1
  } else {
    //CREATE
    //insert into
    //ID :  vient de appwrite
   await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
    searchTerm,
    count: 1,
    movie_id: movie.id,
    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
   })
  }
 } catch (error) {
  console.error(error);
 }
}

export const getTrendingMovies = async () => {
 try {
  //READ
  //Select * from COLLECTION_ID order by count DESC
  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.limit(5),
    Query.orderDesc("count")
  ])

  return result.documents;
 } catch (error) {
  console.error(error);
 }
}