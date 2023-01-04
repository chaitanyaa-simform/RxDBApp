import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppContext } from '../../../App';
import { getRandomColor } from '../../services/utils';
import { HeroesCollectionName } from '../../store/database/InitializeDatabase';
import styles from './styles';

// create a component
const Heros = () => {
  const { db } = useContext(AppContext);
  const [name, setName] = useState('');
  const [heroes, setHeroes] = useState([]);

  const plusIcon =
    'https://img.icons8.com/external-neu-royyan-wijaya/512/external-add-neu-interface-neu-royyan-wijaya-2.png';
  const deleteIcon =
    'https://img.icons8.com/external-creatype-outline-colourcreatype/512/external-app-web-application-2-creatype-outline-colourcreatype-20.png';

  useEffect(() => {
    let sub: any;
    if (db && db[HeroesCollectionName]) {
      sub = db[HeroesCollectionName].find()
        .sort({ name: 1 })
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
    await db[HeroesCollectionName].insert({ name, color });
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
                  uri: plusIcon,
                }}
              />
            </TouchableOpacity>
          )}
        </View>
        {heroes.length === 0 && (
          <Text style={{ marginVertical: 20 }}>
            {'No heroes to display ...'}
          </Text>
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
                  uri: deleteIcon,
                }}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

//make this component available to the app
export default Heros;
