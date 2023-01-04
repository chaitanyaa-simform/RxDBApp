import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
