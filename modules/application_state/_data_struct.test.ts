import { DataStruct } from './_data_struct';

function getTypicalState(): {
  name: string;
  age: number;
  location: {
    country: string;
  };
} {
  return {
    name: 'max',
    age: 25,
    location: {
      country: 'sweden',
    },
  };
}

test('asserts that a DataStruct inserts new data and does not destroy previous', () => {
  const data = new DataStruct(getTypicalState());

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

test('asserts that DataStruct keeps object identity', () => {
  const state = getTypicalState();
  const data = new DataStruct(state);

  state.location.country = 'norway';
  data.insert({
    location: state.location,
  });

  const extracted_data = data.extract();
  expect(extracted_data.location.country).toEqual('norway');
  expect(extracted_data.location).toBe(extracted_data.location);
});

test('asserts that iteration over keys works', () => {
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

test('asserts that typescript accepts both "type" and "interface"', () => {
  // Not really a Jest test, more to check that the type works
  type T1 = {
    a: 'a';
  };
  new DataStruct<T1>({
    a: 'a',
  });

  interface T2 {
    a: 'a';
  }
  new DataStruct<T2>({
    a: 'a',
  });

  interface T3 {
    a: 'a';
    [index: string]: string;
  }
  new DataStruct<T3>({
    a: 'a',
  });

  type T4 = {
    a: 'a';
    [index: string]: string;
  };
  new DataStruct<T4>({
    a: 'a',
  });
});
