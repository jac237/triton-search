/* eslint-disable */
import db from '@/db';
// const departments =

const state = {
  departments: [],
  results: [],
  courses: [],
};

const mutations = {
  setDepartments(state, departments) {
    state.departments = departments;
  },
  setResults(state, results) {
    state.results = results;
  },
  addCourse(state, courses) {
    state.courses.push(courses);
  },
  deleteCourse(state, index) {
    state.courses.splice(index, 1);
  },
};

const actions = {
  async init({ commit }) {
    db.collection('departments')
      .get()
      .then(querySnapshot => {
        const departments = [];
        querySnapshot.forEach(doc => {
          const department = doc.data();
          departments.push(department);
          // console.log(department);
        });
        commit('setDepartments', departments);
      });
  },
  async searchCourseItems({ commit }, selected) {
    db.collection('departments').doc(selected).collection('courses')
      .get()
      .then(querySnapshot => {
        const results = [];
        querySnapshot.forEach(doc => {
          const result = doc.data();
          results.push(result);
        });
        commit('setResults', results);
        // console.log(results);
      });
  },
  async addCourseItem({ commit }, path) {
    const tr = path.find(element => element.nodeName === 'TR');
    const id = tr.children[1].innerText;
    const course = state.results.find(row => row.id === id);
    const found = state.courses.find(row => row.id === id);
    // Prevent duplicate adds.
    if (!found) {
      // Push course item into coures array using commit function.
      // console.log('Adding course:', course);
      commit('addCourse', course);
    }
  },
  async deleteCourseItem({ commit }, path) {
    const div = path.find(element => element.className === 'columns');
    const id = div.getAttribute('id');
    let index;
    state.courses.find((row, idx) => {
      if (row.id === id) {
        index = idx;
        return true;
      }
      return false;
    });
    // Remove course item from courses array using commit function.
    // console.log('Deleting course at index: ', index);
    commit('deleteCourse', index);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
