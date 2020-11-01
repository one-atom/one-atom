import { DataStruct } from '../src/_data_struct';

function get_typical_state() {
  return {
    name: 'max',
    age: 25,
    location: {
      country: 'sweden',
    },
  };
}

describe('Data Struct', () => {
  it('should insert new data and not destroy previous', () => {
    const data = new DataStruct(get_typical_state());

    data.insert({
      name: 'ezra',
    });
    expect(data.extract()).toMatchInlineSnapshot(`
      Object {
        "age": 25,
        "location": Object {
          "country": "sweden",
        },
        "name": "ezra",
      }
    `);

    data.insert({
      age: 22,
    });
    expect(data.extract()).toMatchInlineSnapshot(`
      Object {
        "age": 22,
        "location": Object {
          "country": "sweden",
        },
        "name": "ezra",
      }
    `);

    data.insert({
      location: {
        country: 'norway',
      },
    });
    expect(data.extract()).toMatchInlineSnapshot(`
      Object {
        "age": 22,
        "location": Object {
          "country": "norway",
        },
        "name": "ezra",
      }
    `);

    data.insert({
      age: 25,
      name: 'max',
      location: {
        country: 'sweden',
      },
    });
    expect(data.extract()).toMatchInlineSnapshot(`
      Object {
        "age": 25,
        "location": Object {
          "country": "sweden",
        },
        "name": "max",
      }
    `);
  });

  it('should keep object reference', () => {
    const state = get_typical_state();
    const data = new DataStruct(state);

    state.location.country = 'norway';
    data.insert({
      location: state.location,
    });

    const extracted_data = data.extract();
    expect(extracted_data.location.country).toEqual('norway');
    expect(extracted_data.location).toBe(extracted_data.location);
  });

  it('should iterate over keys', () => {
    const data = new DataStruct({
      a: '1',
      b: '1',
      c: '1',
    });

    let i = 0;

    Array.from(data.toIter()).forEach(([, value]) => {
      i++;
      expect(value).toEqual('1');
    });

    expect(i).toEqual(3);
  });
});
