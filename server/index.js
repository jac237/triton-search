const fetch = require('node-fetch');
const cheerio = require('cheerio');
const db = require('./db');

/*
 */
const delay = (miliseconds) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, miliseconds);
  });
}

/*
 */
const trimWhitespace = (string) => {
  return string.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
}

/*
 */
const getDepartments = async () => {
  const url = 'https://ucsd.edu/catalog/front/courses.html';
  const response = await fetch(url);
  const body = await response.text();
  const $ = cheerio.load(body);

  const promises = [];

  $('a').each((i, item) => {
    const $item = $(item);
    const value = $item.text();

    if (value === 'courses') {
      const title = trimWhitespace($item.parents('p').text()).split('[')[0];
      const path = $item.attr('href');
      const acronym = path.replace(/\//g, '.').split('.').slice(-2, -1)[0];
      
      const department = {
        title: title.slice(0, -1),
        website: url + '/../' + path,
        acronym
      }
      
      // const newDepartmentRef = db.collection('departments').doc(acronym);
      promises.push(newDepartmentRef.set(department));
    }
  });

  await Promise.all(promises);
  console.log('getDepartments(): Done! 🏫');
}

/*
 */
const getCourses = async (department) => {
  const url = `https://ucsd.edu/catalog/courses/${department.toUpperCase()}.html`;
  const response = await fetch(url);
  const body = await response.text();
  const $ = cheerio.load(body);

  const promises = [];

  $('.course-name').each((i, item) => {
    const $item = $(item);

    let name = $item.text().replace(/\/\t\n/g, '');
    let id = name.split('.')[0];
    name = name.replace(id + '.', '').replace(/[\s ]/,'');
    
    let units;
    try {
      units = name.match(/\(\d.*\)/)[0];
      name = name.replace(units, '');
    } catch(error) {
      units = 'N/A';
      // console.log('Unable to parse: ', name);
    }
    const [description, prereqs] = $item.next().text().replace(/\t\n\r/g, '').split('Prerequisites:');

    id = id.replace(/\//g, '-');
    // name = name.replace(/\/\t/g, '');

    const course = {
      id,
      name: name.trim(),
      department,
      units: units,
      description: description.trim(),
      prereqs: (!prereqs) ? 'None.' : prereqs.trim()
    }

    // console.log(id, name);

    // const newCourseRef = db.collection('departments').doc(department).collection('courses').doc(id);
    // promises.push(newCourseRef.set(course));
  });

  await Promise.all(promises);
  console.log(`getCourses(${department}): Done! 📚`);
}

const getAllCourses = async () => {
  const departmentsRef = db.collection('departments');
  const snapshot = await departmentsRef.get();

  if (snapshot.empty) {
    console.log('getAllCourses(): No documents! 🤧');
    return;
  }  

  const departments = []

  snapshot.forEach(doc => {
    departments.push(doc.data().acronym)
  });

  for (const department of departments) {
    await getCourses(department);
    await delay(1000); // 1 second (1000 ms)
  }
  console.log('getAllCourses(): Done! 📚📚📚');
}

// getCourses('ANTH');
// getDepartments();
getAllCourses();