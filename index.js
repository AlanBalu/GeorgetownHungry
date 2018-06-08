/*
    Author: Alan Balu
    Version: 3.0
    Date: 6/7/2018

    Copyright (c) 2018, Alan Balu
*/

'use strict';
const Alexa = require('alexa-sdk');
var request = require('request');
var cheerio = require('cheerio'); 

const APP_ID = 'amzn1.ask.skill.52f23934-7e63-4d38-8f75-a8cf9a6ada1e';

const SKILL_NAME = 'Georgetown Hungry';
const GET_FACT_MESSAGE = " ";
const HELP_MESSAGE = "You can say STOP or leos menu or leos breakfast menu or What's the sazOwn menu... What can I help you with?";
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

        const URL = "https://www.hoyaeats.com/locations/fresh-food-company/";
        const Bodega_stem = "https://www.hoyaeats.com/locations/leo-mkt-bodega/";
        const FiveSpice_stem = "https://www.hoyaeats.com/locations/leo-mkt-5spice/";
        const OliveBranch_stem = "https://www.hoyaeats.com/locations/leo-mkt-olive-branch/";
        const Launch_stem = "https://www.hoyaeats.com/locations/leo-mkt-launch/";
        const Sazon_stem = "https://www.hoyaeats.com/locations/leo-mkt-sazon/";

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context, callback);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {

    'LaunchRequest': function () {
        console.log(URL);

        //----------------------------

        this.emit('BeginIntent');

        //----------------------------

    },

    'Unhandled': function () {
        this.emit('FullMenuIntent');
    },

    'FullMenuIntent': function () {
        
        var speechOutput = GET_FACT_MESSAGE;
        var cardOutput = "Georgetown Leo's : ";

        var self = this;

        const breakfast_list = [];
        const lunch_list = [];
        const dinner_list = [];

        var data = {
            breakfast: breakfast_list,
            lunch: lunch_list,
            dinner: dinner_list
        }

        var list = [];

        console.log("completed initial stuff");

        function webScrape () {

          return new Promise(
              function (resolve, reject) {

                  request(URL, function (error, response, html) {

                        console.log("working...");

                         if (!error && response.statusCode == 200) {
                            var $ = cheerio.load(html);

                            //element in list
                            var iterator = 0;

                            var time = 1;

                            $('h4.toggle-menu-station-data').each(function(i, elem) { 

                              if ($(this).text() == "Comfort") {

                                      if (time == 1) {
                                          console.log("\n" + "breakfast: " + "\n"); 
                                      }
                                      else if (time == 2) {
                                          iterator = 0;
                                          console.log("\n" + "lunch: " + "\n"); 
                                          data.breakfast = list;
                                          list = [];
                                                                   
                                      }
                                      else if (time == 3) {
                                          iterator = 0;
                                          console.log("\n" + "dinner: " + "\n");
                                          data.lunch = list;
                                          list = [];
                
                                      }
                                      else if (time == 4) {
                                          iterator = 0;
                                          console.log("finished");
                                          data.dinner = list;
                                          list = [];
                                      }

                                $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  }); 

                              }
                              else if ($(this).text() == "Harvest") {

                                  $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  });

                              }
                              else if ($(this).text() == "Saute") {

                                  $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  });

                              }
                              else if ($(this).text() == "Allergen") {

                                  $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  });

                                  time++;
                              }

                            });

                            data.dinner = list;
                            list = [];

                            console.log(data); //all the data for food
                            resolve(data);
                            }
                            else {
                                reject("error");
                            }
                    });
              });
        }

        function read_data(data) {

                if ((data.breakfast.length < 1) && (data.lunch.length < 1) && (data.dinner.length < 1)) {
                    speechOutput = speechOutput + "Sorry, Leos is not serving Food today.";
                    cardOutput = cardOutput + "Sorry, Leos is not serving Food today.";
                }

                else {

                    speechOutput = speechOutput + "The Leo's Breakfast menu is: ";
                    for(var i = 0; i < (data.breakfast).length; i++) {
                        speechOutput = speechOutput + " " + data.breakfast[i];

                            if (i != (data.breakfast.length - 2)) {
                                speechOutput = speechOutput + ",";
                            }
                            else {
                            speechOutput = speechOutput + ", and";
                            }

                        cardOutput = cardOutput + " " + data.breakfast[i] + ",";
                    }
                    speechOutput = speechOutput + ". ";


                    speechOutput = speechOutput + "The Leo's Lunch menu is: ";
                    for(var i = 0; i < (data.lunch).length; i++) {
                        speechOutput = speechOutput + " " + data.lunch[i];

                            if (i != (data.lunch.length - 2)) {
                                speechOutput = speechOutput + ",";
                            }
                            else {
                                speechOutput = speechOutput + ", and";
                            }

                        cardOutput = cardOutput + " " + data.lunch[i] + ",";
                    }
                    speechOutput = speechOutput + ". ";


                    speechOutput = speechOutput + "The Leo's Dinner menu is: ";
                    for(var i = 0; i < (data.dinner).length; i++) {
                        speechOutput = speechOutput + " " + data.dinner[i];

                        if (i != (data.dinner.length - 2)) {
                                speechOutput = speechOutput + ",";
                        }
                        else {
                            speechOutput = speechOutput + ", and";
                        }

                        cardOutput = cardOutput + " " + data.dinner[i] + ",";
                    }
                    speechOutput = speechOutput + ". ";
                }
        }


        webScrape().then(
              function(value) { //data object returned

                  read_data(value);

                  console.log("rendering card...");
                  self.response.cardRenderer(SKILL_NAME, cardOutput);
                  console.log("Finished card rendering...speaking");
                  self.response.speak(speechOutput);
                  console.log("emitting");
                  self.emit(':responseReady');
                  self.emit(':tell', STOP_MESSAGE);

              },
              function (reason){
                  console.log("error: " + reason);
        });

        
                
    }, //end getFullMenu

    'GetBreakfastMenu': function () { 

        var speechOutput = GET_FACT_MESSAGE;
        var cardOutput = "Georgetown Leo's Food: ";

        var self = this;

        var list = [];

        console.log("completed initial breakfast stuff");

        function webScrape () {

          return new Promise(
              function (resolve, reject) {

                  request(URL, function (error, response, html) {

                        console.log("working...");

                         if (!error && response.statusCode == 200) {
                            var $ = cheerio.load(html);

                            //element in list
                            var iterator = 0;

                            var time = 1;

                            $('h4.toggle-menu-station-data').each(function(i, elem) { 

                              if ($(this).text() == "Comfort") {

                                      if (time == 1) {
                                          console.log("\n" + "breakfast: " + "\n"); 
                                      }
                                      else if (time == 2) {
                                          return false;                         
                                      }

                                $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  }); 

                              }
                              else if ($(this).text() == "Harvest") {

                                  $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  });

                              }
                              else if ($(this).text() == "Saute") {

                                  $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  });

                              }
                              else if ($(this).text() == "Allergen") {

                                  $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  });

                                  time++;
                              }

                            });

                            resolve(list);
                            console.log(list); //all the data for food
                            }
                            else {
                                reject("error");
                            }
                    });
              });
        }

        function read_data(data) {

            if (data.length < 1) {
                speechOutput = speechOutput + "Sorry. Leo's is not serving Breakfast today.";
                cardOutput = cardOutput + "Sorry, Leos is not serving Food today.";
            }
            else {

                speechOutput = speechOutput + "The Leo's Breakfast menu is: ";
                for(var i = 0; i < (data).length; i++) {
                    speechOutput = speechOutput + " " + data[i];

                    if (i != (data.length - 2)) {
                        speechOutput = speechOutput + ",";
                    }
                    else {
                        speechOutput = speechOutput + ", and";
                    }

                    cardOutput = cardOutput + " " + data[i] + ",";
                }
                speechOutput = speechOutput + ". ";
            }
        }


        webScrape().then(
              function(value) { //data object returned
                  read_data(value);

                  console.log("rendering card...");
                  self.response.cardRenderer(SKILL_NAME, cardOutput);
                  console.log("Finished card rendering...speaking");
                  self.response.speak(speechOutput);
                  console.log("emitting");
                  self.emit(':responseReady');
                  self.emit(':tell', STOP_MESSAGE);

              },
              function (reason){
                  console.log("error: " + reason);
        });

        

    }, //end GetBreakfastMenu

    'GetLunchMenu': function () { 

        var speechOutput = GET_FACT_MESSAGE;
        var cardOutput = "Georgetown Leo's Food: ";

        var self = this;

        var list = [];
        var lunch_list = [];

        console.log("completed initial lunch stuff");

        function webScrape () {

          return new Promise(
              function (resolve, reject) {

                  request(URL, function (error, response, html) {

                        console.log("working...");

                         if (!error && response.statusCode == 200) {
                            var $ = cheerio.load(html);

                            //element in list
                            var iterator = 0;

                            var time = 1;

                            $('h4.toggle-menu-station-data').each(function(i, elem) { 

                              if ($(this).text() == "Comfort") {

                                      if (time == 1) {
                                          console.log("\n" + "breakfast: " + "\n"); 
                                      }
                                      else if (time == 2) {
                                          iterator = 0;
                                          console.log("\n" + "lunch: " + "\n"); 
                                          //list now has all breakfast items
                                          list = [];
                                                                   
                                      }
                                      else if (time == 3) {
                                          iterator = 0;
                                          lunch_list = list;
                                          return false;
                                      }

                                $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  }); 

                              }
                              else if ($(this).text() == "Harvest") {

                                  $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  });

                              }
                              else if ($(this).text() == "Saute") {

                                  $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  });

                              }
                              else if ($(this).text() == "Allergen") {

                                  $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  });

                                  time++;
                              }

                            });

                            resolve(lunch_list);
                            console.log(lunch_list); //all the data for food
                            }
                            else {
                                reject("error");
                            }
                    });
              });
        }

        function read_data(data) {

            if (data.length < 1) {
                speechOutput = speechOutput + "Sorry. Leo's is not serving Lunch today.";
                cardOutput = cardOutput + "Sorry, Leos is not serving Food today.";
            }

            else {

                speechOutput = speechOutput + "The Leo's Lunch menu is: ";
                for(var i = 0; i < (data).length; i++) {
                    speechOutput = speechOutput + " " + data[i];

                    if (i != (data.length - 2)) {
                            speechOutput = speechOutput + ",";
                    }
                    else {
                        speechOutput = speechOutput + ", and";
                    }

                    cardOutput = cardOutput + " " + data[i] + ",";
                }
                speechOutput = speechOutput + ". ";
            }
        }


        webScrape().then(
              function(value) { //data object returned
                  read_data(value);

                  console.log("rendering card...");
                  self.response.cardRenderer(SKILL_NAME, cardOutput);
                  console.log("Finished card rendering...speaking");
                  self.response.speak(speechOutput);
                  console.log("emitting");
                  self.emit(':responseReady');
                  self.emit(':tell', STOP_MESSAGE);

              },
              function (reason){
                  console.log("error: " + reason);
        });

        

    }, //end GetLunchMenu

    'GetDinnerMenu': function () { 

        var speechOutput = GET_FACT_MESSAGE;
        var cardOutput = "Georgetown Leo's Food: ";

        var self = this;

        var list = [];
        var dinner_list = [];

        console.log("completed initial dinner stuff");

        function webScrape () {

          return new Promise(
              function (resolve, reject) {

                  request(URL, function (error, response, html) {

                        console.log("working...");

                         if (!error && response.statusCode == 200) {
                            var $ = cheerio.load(html);

                            //element in list
                            var iterator = 0;

                            var time = 1;

                            $('h4.toggle-menu-station-data').each(function(i, elem) { 

                              if ($(this).text() == "Comfort") {

                                      if (time == 1) {
                                          console.log("\n" + "breakfast: " + "\n"); 
                                      }
                                      else if (time == 2) {
                                          iterator = 0;
                                          console.log("\n" + "lunch: " + "\n"); 
                                          //list now has only breakfast items
                                          list = [];
                                                                   
                                      }
                                      else if (time == 3) {
                                          iterator = 0;
                                          console.log("\n" + "dinner: " + "\n");
                                          //list now has only lunch items
                                          list = [];
                                      }


                                $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  }); 

                              }
                              else if ($(this).text() == "Harvest") {

                                  $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  });

                              }
                              else if ($(this).text() == "Saute") {

                                  $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  });

                              }
                              else if ($(this).text() == "Allergen") {

                                  $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                  });

                                  time++;
                              }

                            });

                            dinner_list = list;

                            resolve(dinner_list);
                            console.log(dinner_list); //all the data for food
                            }
                            else {
                                reject("error");
                            }
                    });
              });
        }

        function read_data(data) {

            if (data.length < 1) {
                speechOutput = speechOutput + "Sorry. Leo's is not serving dinner today.";
                cardOutput = cardOutput + "Sorry, Leos is not serving Food today.";
            }
            else {

                speechOutput = speechOutput + "The Leo's Dinner menu is: ";
                for(var i = 0; i < (data).length; i++) {
                    speechOutput = speechOutput + " " + data[i];

                    if (i != (data.length - 2)) {
                            speechOutput = speechOutput + ",";
                    }
                    else {
                        speechOutput = speechOutput + ", and";
                    }

                    cardOutput = cardOutput + " " + data[i] + ",";
                }
                speechOutput = speechOutput + ". ";
            }
        }


        webScrape().then(
              function(value) { //data object returned
                  read_data(value);

                  console.log("rendering card...");
                  self.response.cardRenderer(SKILL_NAME, cardOutput);
                  console.log("Finished card rendering...speaking");
                  self.response.speak(speechOutput);
                  console.log("emitting");
                  self.emit(':responseReady');
                  self.emit(':tell', STOP_MESSAGE);

              },
              function (reason){
                  console.log("error: " + reason);
        });

        
    }, //end GetDinnerMenu

    'BeginIntent' : function () {

    console.log("URL is: " + URL);

    var new_intent = this.event.request.intent;

        var TimeSlotValid = new_intent && new_intent.slots && new_intent.slots.Time && new_intent.slots.Time.value;
        //var PlaceSlotValid = new_intent && new_intent.slots && new_intent.slots.Place && new_intent.slots.Place.value;

        if (TimeSlotValid) {
            
                var timeName = new_intent.slots.Time.value;
                console.log("slot was: " + timeName);

                if (timeName == 'breakfast') {
                    this.emit('GetBreakfastMenu');
                }
                else if (timeName == 'lunch') {
                    this.emit('GetLunchMenu');
                }
                else if (timeName == 'dinner') {
                    this.emit('GetDinnerMenu');
                }
                else if (timeName == 'Mexican' || timeName == 'sazown') {
                    this.emit('GetUpstairsMenu', Sazon_stem, "Sazown");
                }
                else if (timeName == 'launch') {
                    this.emit('GetUpstairsMenu', Launch_stem, "Launch");
                }
                else if (timeName == 'Asian' || timeName == '5 spice') {
                    this.emit('GetUpstairsMenu', FiveSpice_stem, "Five Spice");
                }
                else if (timeName == 'olive branch') {
                    this.emit('GetUpstairsMenu', OliveBranch_stem, "Olive Branch");
                }
                else if (timeName == 'full') {
                    this.emit('FullMenuIntent');
                }
                else if (timeName == 'bodega') {
                    this.emit('GetUpstairsMenu', Bodega_stem, "Bodega");
                }
                else {
                    console.log("Not sure which time slot");
                    this.emit('AMAZON.HelpIntent');
                }

        } //end if answerslotvalid

        /*else if (PlaceSlotValid) {

            var placeName = new_intent.slots.Place.value;
            console.log("slot was: " + placeName);

            if (placeName == 'Mexican' || placeName == 'sazown') {
                this.emit('GetUpstairsMenu', Sazon_stem, "Sazon");
            }
            else if (placeName == 'launch') {
                this.emit('GetUpstairsMenu', Launch_stem, "Launch");
            }
            else if (placeName == 'Asian' || placeName == '5 spice') {
                this.emit('GetUpstairsMenu', FiveSpice_stem, "Five Spice");
            }
            else if (placeName == 'olive branch') {
                this.emit('GetUpstairsMenu', OliveBranch_stem, "Olive Branch");
            }
            else if (placeName == 'bodega') {
                this.emit('GetUpstairsMenu', Bodega_stem, "Bodega");
            }
            else {
                console.log("Not sure which time slot");
                this.emit('AMAZON.HelpIntent');
            }

        } */

        else {
                console.log("No time slot");
                this.emit('FullMenuIntent');
        }

    },

    'GetUpstairsMenu': function (right_URL, location) {

        //right_URL is the URL for the correct upstairs leos restaurant 

        var speechOutput = GET_FACT_MESSAGE;
        var cardOutput = "Georgetown Leo's Food: ";

        var self = this;

        var list = [];

        console.log("completed initial " + location + " stuff");

        function webScrape () {

          return new Promise(
              function (resolve, reject) {

                  request(right_URL, function (error, response, html) {

                        console.log("working...");

                         if (!error && response.statusCode == 200) {
                            var $ = cheerio.load(html);

                            //element in list
                            var iterator = 0;

                            var time = 1;

                            $('h4.toggle-menu-station-data').each(function(i, elem) { 

                                $(this).next().find('li').each(function(i, elem) {
                                      
                                      var menu_item = $(this).text();
                                      menu_item = menu_item.replace(/(\r\n\t|\n|\r\t|\t|\s\s)/gm,"");
                                      menu_item = menu_item.replace(/(&)/gm, "and");
                                      list[iterator] = menu_item;
                                      iterator++;
                                      console.log(menu_item);
                                }); 

                                time++;

                                if (time > 1) {
                                    return false;
                                }
                            });

                            resolve(list);
                            console.log(list); //all the data for food
                            }
                            else {
                                reject("error");
                            }
                    });
              });
        }

        function read_data(data) {

            if (data.length < 1) {
                
                speechOutput = speechOutput + "Sorry! " + location + " is not serving food today.";
                cardOutput = cardOutput + "Sorry! " + location + " is not serving food today.";
            }
            else {

                speechOutput = speechOutput + "The " + location + " menu is: ";
                for(var i = 0; i < (data).length; i++) {
                    speechOutput = speechOutput + " " + data[i];

                    if (i != (data.length - 2)) {
                            speechOutput = speechOutput + ",";
                    }
                    else {
                        speechOutput = speechOutput + ", and";
                    }

                    cardOutput = cardOutput + " " + data[i] + ",";
                }
                speechOutput = speechOutput + ". ";
            }
        }


        webScrape().then(
              function(value) { //data object returned
                  read_data(value);

                  console.log("rendering card...");
                  self.response.cardRenderer(SKILL_NAME, cardOutput);
                  console.log("Finished card rendering...speaking");
                  self.response.speak(speechOutput);
                  console.log("emitting");
                  self.emit(':responseReady');
                  self.emit(':tell', STOP_MESSAGE);

              },
              function (reason){
                  console.log("error: " + reason);
        });

    }, //end GetUpstairsMenu


    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        //this.response.speak(STOP_MESSAGE);
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        //this.response.speak(STOP_MESSAGE);
        this.emit(':tell', STOP_MESSAGE);
    },
};

