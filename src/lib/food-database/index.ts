import { FoodItem } from '../types';
import { fruits } from './foods/fruits';
import { fruitsTropical } from './foods/fruits-tropical';
import { vegetables } from './foods/vegetables';
import { vegetablesExotic } from './foods/vegetables-exotic';
import { proteins } from './foods/proteins';
import { proteinFocused } from './foods/protein-focused';
import { veganProtein } from './foods/vegan-protein';
import { moreProteins } from './foods/more-proteins';
import { grains } from './foods/grains';
import { dairy } from './foods/dairy';
import { legumes } from './foods/legumes';
import { nutsSeeds } from './foods/nuts-seeds';
import { oils } from './foods/oils';
import { fatsSpreads } from './foods/fats-spreads';
import { beverages } from './foods/beverages';
import { beveragesCold } from './foods/beverages-cold';
import { condiments } from './foods/condiments';
import { wholeSpices } from './foods/whole-spices';
import { bakingIngredients } from './foods/baking-ingredients';
import { commonFoodTerms } from './foods/common-food-terms';
import { snacksChips } from './foods/snacks-chips';
import { fastFood } from './foods/fast-food';
import { dessertsSweets } from './foods/desserts-sweets';
import { breakfastItems } from './foods/breakfast-items';
import { moreBreakfast } from './foods/more-breakfast-grains';
import { morePreparedDishes } from './foods/more-prepared';
import { indianDishes } from './foods/indian-dishes';
import { indianDishesExtra } from './foods/indian-dishes-extra';
import { indianDishesExtra2 } from './foods/indian-dishes-extra2';
import { indianDishesExtra3 } from './foods/indian-dishes-extra3';
import { indianDishesExtra4 } from './foods/indian-dishes-extra4';
import { indianDishesExtra5 } from './foods/indian-dishes-extra5';
import { indianDishesExtra6 } from './foods/indian-dishes-extra6';
import { messMenuFoods } from './foods/mess-menu';
import { indianSnacks } from './foods/indian-snacks';
import { southIndian } from './foods/south-indian';
import { chineseDishes } from './foods/chinese-dishes';
import { chineseDishesExtra } from './foods/chinese-dishes-extra';
import { japaneseDishes } from './foods/japanese-dishes';
import { japaneseExtra, koreanExtra } from './foods/east-asian-extra';
import { koreanDishes } from './foods/korean-dishes';
import { thaiDishes } from './foods/thai-dishes';
import { thaiExtra, mexicanExtra, mediterraneanExtra } from './foods/more-cuisines';
import { mexicanDishes } from './foods/mexican-dishes';
import { mediterraneanDishes } from './foods/mediterranean-dishes';
import { middleEastern } from './foods/middle-eastern';
import { pizzaPasta } from './foods/pizza-pasta';
import { soupsStews } from './foods/soups-stews';
import { soupsStewsExtra, snacksExtra } from './foods/more-categories';
import { africanCaribbean } from './foods/african-caribbean';

export const allFoods: FoodItem[] = [
  ...fruits,
  ...fruitsTropical,
  ...vegetables,
  ...vegetablesExotic,
  ...proteins,
  ...proteinFocused,
  ...veganProtein,
  ...moreProteins,
  ...grains,
  ...dairy,
  ...legumes,
  ...nutsSeeds,
  ...oils,
  ...fatsSpreads,
  ...beverages,
  ...beveragesCold,
  ...condiments,
  ...wholeSpices,
  ...bakingIngredients,
  ...snacksChips,
  ...snacksExtra,
  ...fastFood,
  ...dessertsSweets,
  ...breakfastItems,
  ...moreBreakfast,
  ...morePreparedDishes,
  ...indianDishes,
  ...indianDishesExtra,
  ...indianDishesExtra2,
  ...indianDishesExtra3,
  ...indianDishesExtra4,
  ...indianDishesExtra5,
  ...indianDishesExtra6,
  ...messMenuFoods,
  ...indianSnacks,
  ...southIndian,
  ...chineseDishes,
  ...chineseDishesExtra,
  ...japaneseDishes,
  ...japaneseExtra,
  ...koreanDishes,
  ...koreanExtra,
  ...thaiDishes,
  ...thaiExtra,
  ...mexicanDishes,
  ...mexicanExtra,
  ...mediterraneanDishes,
  ...mediterraneanExtra,
  ...middleEastern,
  ...pizzaPasta,
  ...soupsStews,
  ...soupsStewsExtra,
  ...africanCaribbean,
  ...commonFoodTerms,
];

export {
  fruits, fruitsTropical, vegetables, vegetablesExotic, proteins, proteinFocused, veganProtein,
  moreProteins, grains, dairy, legumes, nutsSeeds, oils, fatsSpreads, beverages, beveragesCold,
  condiments, wholeSpices, bakingIngredients, snacksChips, snacksExtra, fastFood, dessertsSweets,
  breakfastItems, moreBreakfast, morePreparedDishes, indianDishes, indianDishesExtra, indianSnacks,
  southIndian, chineseDishes, chineseDishesExtra, japaneseDishes, japaneseExtra, koreanDishes,
  koreanExtra, thaiDishes, thaiExtra, mexicanDishes, mexicanExtra, mediterraneanDishes,
  mediterraneanExtra, middleEastern, pizzaPasta, soupsStews, soupsStewsExtra, africanCaribbean,
  commonFoodTerms,
};
