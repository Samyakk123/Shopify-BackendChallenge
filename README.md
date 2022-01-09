# <p align="center">Inventory Tracking Web Application</p>

## <p align="center">Shopify Summer 2022 Backend/Infrastructure Developer/Engineer Challenge</p>

<img src="https://github.com/Samyakk123/Goblin-fighters/blob/main/temp2.gif" width="1000" height="500" />


# 🔗 Public Links

- Public Link: https://shopifybackendchallenge.herokuapp.com/
- Swagger link (REST API Documentation): https://shopifybackendchallenge.herokuapp.com/api-docs/

# 💻 Technologies used

- MERN Stack (MongoDb, Express.js, React, Node.js)
- Mongoose (ODM for MongoDb, To create schemas and validate information)
- JavaScript
- Swagger (API Documentation)
- Heroku

# 💡 Implementation Details

- Since MongoDb doesn't enforce document structure, I decided to utilize **mongoose** to create concrete schemas with constraints perform easy adn effective validation checking, adn easier querying/filtering which provided very beneficial when implementing the CRUD functionalities
- I decided to use **Swagger** to create interactive API documentation for users to directly test out my backend endpoints alongside seeing their input values and formatting (however, you can also use another tool such as Postman)
- I also decided to deploy my project on **Heroku** so that the entire tedious process of running it locally as mentioned below could be avoided. This allows for anyone to easily access the website and test out my program

# 🚩 Requirements

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

- ## Node version >= 16.0.0
  ![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)
- ## Create a .env file with the following content (Must have a MongoDb database):

```env
DATABASE_URI=<MONGODB DATABASE CONNECTION LINK HERE>
```

![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)

# 💾 Local Development

As an alternative to the public links provided **above**. I will list the steps to run this program locally below. Please ensure you have the requirements stated above

🔎 clone this repository inside your local computer `git clone https://github.com/Samyakk123/Shopify-SummerChallenge`

🔎 cd into the root directory of the project

```diff
👉 ls

# Shopify-SummerChallenge

👉 cd Shopify-SummerChallenge
```

🔎 From there run the following commands:

```diff
👉 cd Frontend && npm run build

# <...Boring production build here...>

👉 cd ../backend && npm run start:dev
```

<p align="center">Viola! That's all you need! Now you can simply go to <a href="http://localhost:5000/">http://localhost:5000/</a> and begin interacting with the project! You can also view the API documentation found at: <a href="http://localhost:5000/api-docs">API Docs</a> (make sure running locally) </p>
