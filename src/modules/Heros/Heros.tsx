import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {AppContext} from '../../../App';
import {HeroesCollectionName} from '../../store/database/InitializeDatabase';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  while (color.length < 7) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// create a component
const Heros = () => {
  const {db} = useContext(AppContext);
  const [name, setName] = useState('');
  const [heroes, setHeroes] = useState([]);

  useEffect(() => {
    let sub: any;
    if (db && db[HeroesCollectionName]) {
      sub = db[HeroesCollectionName].find()
        .sort({name: 1})
        .$.subscribe((rxdbHeroes: any) => {
          setHeroes(rxdbHeroes);
        });
    }
    return () => {
      if (sub && sub.unsubscribe) {
        sub.unsubscribe();
      }
    };
  }, [db]);

  const addHero = async () => {
    console.log('addHero: ' + name);
    const color = getRandomColor();
    console.log('color: ' + color);
    await db[HeroesCollectionName].insert({name, color});
    setName('');
  };

  const removeHero = async (hero: any) => {
    Alert.alert(
      'Delete hero?',
      `Are you sure you want to delete ${hero.get('name')}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            const doc = db[HeroesCollectionName].findOne({
              selector: {
                name: hero.get('name'),
              },
            });
            await doc.remove();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.topContainer}>
      <ScrollView style={styles.heroesList}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={heroName => setName(heroName)}
            placeholder="Type to add a hero..."
            onSubmitEditing={addHero}
          />
          {name.length > 1 && (
            <TouchableOpacity onPress={addHero}>
              <Image
                style={styles.plusImage}
                source={{
                  uri: 'https://img.icons8.com/external-neu-royyan-wijaya/512/external-add-neu-interface-neu-royyan-wijaya-2.png',
                }}
              />
            </TouchableOpacity>
          )}
        </View>
        {heroes.length === 0 && (
          <Text style={{marginVertical: 20}}>{'No heroes to display ...'}</Text>
        )}
        {heroes.map((hero: any, index) => (
          <View style={styles.card} key={index}>
            <View
              style={[
                styles.colorBadge,
                {
                  backgroundColor: hero.get('color'),
                },
              ]}
            />
            <Text style={styles.heroName}>{hero.get('name')}</Text>
            <TouchableOpacity
              onPress={() => removeHero(hero)}
              style={styles.alignRight}>
              <Image
                style={styles.deleteImage}
                source={{
                  uri: 'https://img.icons8.com/external-creatype-outline-colourcreatype/512/external-app-web-application-2-creatype-outline-colourcreatype-20.png',
                }}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// define your styles
const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    backgroundColor: 'pink',
    flex: 1,
  },
  title: {
    marginTop: 55,
    fontSize: 25,
    color: 'white',
    fontWeight: '500',
  },
  heroesList: {
    marginTop: 30,
    borderRadius: 5,
    flex: 1,
    width: '90%',
    paddingLeft: 15,
    marginHorizontal: 15,
    backgroundColor: 'white',
  },
  plusImage: {
    width: 30,
    height: 30,
    marginRight: 15,
    marginLeft: 'auto',
  },
  deleteImage: {
    width: 30,
    height: 30,
    marginRight: 15,
  },
  alignRight: {
    marginLeft: 'auto',
  },
  input: {
    flex: 1,
    color: 'black',
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 12,
    paddingVertical: 15,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.5,
  },
  colorBadge: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 15,
  },
  heroName: {
    fontSize: 18,
    fontWeight: '200',
    marginTop: 3,
  },
});

//make this component available to the app
export default Heros;
