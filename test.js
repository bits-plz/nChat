const { MongoClient } = require('mongodb');
console.log('damn')
const uri = "mongodb+srv://bitsPlzADMIN:2UN6CHs6RHL3vVg@cluster0.jordu.mongodb.net/nChat?retryWrites=true&w=majority";


async function main() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
 
    // await findByName(client, "Cheerful new renovated central apt")

    await findWthMinBathRoomsMinBedRoomsMostRecentReviews(client ,{minimumNumberOfBathrooms : 2 , minimumNumberOfBedrooms :3, maximumNumberOfResults: 10})
  } catch (error) {
    throw error
  }finally{
    await client.close()
  }
}

main().catch(err=> console.log(err))


async function listDatabases(client){
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};


async function createListing(client, listName){
  const res = await client.db('sample-airbnb').collection('listingsAndReviews').insertOne(listName)

  console.log(`New listing created with name ${listName} and id = ${res.insertedId}`)

}

async function findByName(client, listingName){
  const res = await client.db('sample_airbnb').collection('listingsAndReviews').findOne({ name : listingName})

  if(res){
    console.log(`Found a listing with id ${res._id}`) 
    console.log(res)
  }
  else console.log('didin"t find')
}

async function findWthMinBathRoomsMinBedRoomsMostRecentReviews(client , {
  minimumNumberOfBedrooms = 0,
  minimumNumberOfBathrooms = 0,
  maximumNumberOfResults = Number.MAX_SAFE_INTEGER
}){
  const cursor = await client.db('sample_airbnb').collection('listingsAndReviews').find(
    {
      bedrooms : {$gte : minimumNumberOfBedrooms},
      bathrooms : {$gte : minimumNumberOfBathrooms},
    }
  ).sort({lastReview : -1}).limit(maximumNumberOfResults)
    
  const res = await cursor.toArray()

  if(res.length > 0){
    res.forEach((r, i )=>{
      console.log()
      console.log(`${i+1} -> ${r.name}  with id = ${r._id}`)
      if(r.last_review)console.log(new Date(r.last_review).toDateString())
      
    })
  }
}
