/* eslint-disable */
import db from '@/db';
// const departments =

const state = {
  departments: [],
  results: [],
  courses: {},
};

const mutations = {
  setDepartments(state, departments) {
    state.departments = departments;
  },
  setResults(state, results) {
    state.results = results;
  },
  addCourse(state, course) {
    state.courses = { ...state.courses };
    state.courses[course.id] = course;
    console.log(state.courses);
  },
  deleteCourse(state, courseId) {
    delete state.courses[courseId];
    state.courses = { ...state.courses };
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
  async addCourseItem({ commit }, course) {
    // console.log(course.id, course);
    // Check if key already exists in dictionary
    if (course.id in state.courses) {
      return null;
    } else {
      commit('addCourse', course);
      return course.id;
    }
  },
  async deleteCourseItem({ commit }, id) {
    commit('deleteCourse', id);
    return id;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
