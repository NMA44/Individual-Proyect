const { Dog, Temperament } = require("../db");
const { Op } = require("sequelize");
const axios = require("axios");
const { API_KEY, API_URL } = process.env;

const postDog = async (req, res) => {
  const {
    name,
    maxHeight,
    minHeight,
    maxWeight,
    minWeight,
    image,
    life_expectancy,
    temperament,
  } = req.body;
  const dogChecked = await Dog.findOne({
    where: { name: name },
  });
  if (dogChecked) {
    return res.status(404).send("The dog already exist");
  } else {
    try {
      const newDog = await Dog.create({
        name,
        maxHeight,
        minHeight,
        maxWeight,
        minWeight,
        image,
        life_expectancy,
      });

      let dogTemp = await Temperament.findAll({
        where: {
          name: temperament,
        },
      });

      await newDog.addTemperament(dogTemp);
      // testing
      res.status(201).send("Dog created");
    } catch (error) {
      return res.status(200).send("The dog was created");
    }
  }
};
const getDog = async (req, res) => {
  const { name } = req.query;
  let dogsApi = await axios.get(`${API_URL}?api_key=${API_KEY}`);

  try {
    if (name) {
      let dogsDb = await Dog.findAll({
        include: Temperament,
        where: {
          name: {
            [Op.iLike]: "%" + name + "%",
          },
        },
        order: [["name", "ASC"]],
      });

      let dogsDbFiltered = dogsDb.map((ele) => {
        return {
          id: ele.id,
          image: ele.image,
          name: ele.name,
          temperaments: ele.temperaments.map((ele) => ele.name),
          weight: `${ele.minWeight} - ${ele.maxWeight}`,
        };
      });

      let findDog = dogsApi.data.filter((ele) =>
        ele.name.toLowerCase().includes(name.toLocaleLowerCase())
      );

      let findDogFiltered = await findDog.map((ele) => {
        return {
          id: ele.id,
          image: ele.image.url,
          name: ele.name,
          temperament: ele.temperament,
          weight: ele.weight.metric,
        };
      });

      let result = dogsDbFiltered.concat(findDogFiltered);
      result.length ? res.json(result) : res.status(404).send("No dog found");
    } else {
      let arrangeTemp = [];

      let dogsApi = await axios.get(`${API_URL}?api_key=${API_KEY}`);
      let dogsDb = await Dog.findAll({
        include: Temperament,
      });

      let dogsDbFiltered = dogsDb.map((ele) => {
        return {
          id: ele.id,
          image: ele.image,
          name: ele.name,
          temperament: ele.temperaments.map((ele) => ele.name),
          weight: `${ele.minWeight} - ${ele.maxWeight}`,
        };
      });

      dogsApi.data.map((ele) => {
        arrangeTemp.push({
          id: ele.id,
          image: ele.image.url,
          name: ele.name,
          temperament: Object.assign([], ele.temperament).join("").split(","),
          weight: ele.weight.metric,
        });
      });

      let allDogsFiltered = dogsDbFiltered.concat(arrangeTemp);

      return res.send(allDogsFiltered);
    }
  } catch (error) {
    res.status(404).send({ error: "The dog is at the park" });
  }
};
const getRaza = async (req, res) => {
  const { dogId } = req.params;
  let dogsApi = await axios.get(`${API_URL}?api_key=${API_KEY}`);

  try {
    if (
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        dogId
      )
    ) {
      let dogsDb = await Dog.findAll({
        include: Temperament,
        where: {
          id: dogId,
        },
      });
      let dogsDbFiltered = dogsDb.map((ele) => {
        return {
          id: ele.id,
          image: ele.image,
          name: ele.name,
          temperament: ele.temperaments.map((ele) => ele.name),
          weight: `${ele.minWeight} - ${ele.maxWeight}`,
          height: `${ele.minHeight} - ${ele.maxHeight}`,
          life_expectancy: ele.life_expectancy,
        };
      });

      res.json(dogsDbFiltered);
    } else {
      let findDog = await dogsApi.data.filter((ele) => ele.id == dogId);
      let dogsApiFiltered = await findDog.map((ele) => {
        return {
          id: ele.id,
          image: ele.image.url,
          name: ele.name,
          temperament: Object.assign([], ele.temperament).join("").split(","),
          weight: ele.weight.metric,
          height: ele.height.metric,
          life_expectancy: ele.life_span,
        };
      });
      dogsApiFiltered.length
        ? res.json(dogsApiFiltered)
        : res.status(404).send("Sorry we couldn't find anything :(");
    }
  } catch (error) {
    return res.status(404).send({ error: "asdasd" });
  }
};
const getTemperaments = async (req, res) => {
  let dogsApi = await axios.get(`${API_URL}?api_key=${API_KEY}`);

  try {
    const temperament = await dogsApi.data.map((el) => el.temperament);

    let tempJoin = temperament.join(",").split(",");

    let final = [...new Set(tempJoin)];
    console.log(final);

    let finalTrim = [];
    for (let j = 0; j < final.length; j++) {
      finalTrim.push(final[j]);
    }

    for (let i = 0; i < finalTrim.length; i++) {
      await Temperament.findOrCreate({
        where: {
          name: finalTrim[i],
        },
      });
    }

    let load = await Temperament.findAll();

    res.json(load);
  } catch (error) {
    res.status(404).send({ error: "There are not temperaments" });
  }
};

const patchDog = async (req, res) => {
  const { dogId } = req.params;
  const { name, maxHeight, minHeight, maxWeight, minWeight, image } = req.body;
  try {
    await Dog.update(
      { name, maxHeight, minHeight, maxWeight, minWeight, image },
      { where: { id: dogId } }
    );
    return res.send("The dog was updated");
  } catch (error) {
    res.send("The dog wasn't update");
  }
};
const deleteDog = async (req, res) => {
  const { dogId } = req.params;
  try {
    await Dog.destroy({
      where: { id: dogId },
    });
    res.send("The dog was delete");
  } catch (error) {
    res.send({ error: "The dog wasn't delete" });
  }
};
module.exports = {
  postDog,
  getDog,
  getRaza,
  getTemperaments,
  patchDog,
  deleteDog,
};
