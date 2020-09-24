<template>
  <section class="home is-family-sans-serif has-text-centered">
    <div class="sidebar-page">
      <section class="sidebar-layout">
          <!-- ADDED COURSES SIDEBAR -->
        <b-sidebar
          v-if="typeof courses[0] != 'undefined'"
          position="static"
          mobile="reduce"
          expand-on-hover
          type="is-light"
          fullheight
          open>
          <div class="p-1 added-list has-text-left" :data="courses">
            <label class="label">Added Courses:</label>
            <div
              class="columns"
              v-for="course in courses"
              :key="course.id"
              :id="course.id">
              <div class="column is-three-quarters">
                <p>
                  <strong>{{ course.id }}</strong>
                  <br>
                  {{ course.name }}
                </p>
              </div>
              <div class="column" style="margin: auto;">
                <button class="button is-danger" @click="onDeleteCourse($event)">
                  <span class="icon is-small">
                    <i class="fas fa-trash"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </b-sidebar>
        <div class="p-2" style="flex-grow: 1; padding-left:5%; padding-right:5%">
          <Disclaimer />
          <!-- SEARCH SELECTION -->
          <section class="search has-text-left mb-5">
            <form @submit.prevent="onSearchCourses()">
              <b-field
                label="Search by Deparment:">
                <b-select
                  expanded
                  required
                  v-model="selected">
                  <option disabled value="">Select a department</option>
                  <option
                    v-for="department in departments"
                    :key="department.acronym"
                    :value="{ value: department.acronym}">
                    {{department.acronym}} - {{department.title}}
                  </option>
                </b-select>
                <button class="button is-info">Search</button>
              </b-field>
            </form>
          </section>
          <!-- SEARCH RESULTS TABLE -->
          <section
            class="results-list has-text-left mb-5"
            v-if="typeof results[0] != 'undefined'">
            <label class="label">Results:</label>
            <b-table
              :data="results"
              ref="tableResults"
              :striped="true"
              :hoverable="true"
              :focusable="true"
              :opened-detailed="defaultOpenedDetails"
              detailed
              detail-key="id"
              :show-detail-icon="true"
              :paginated="true"
              :per-page="10"
              pagination-position="bottom"
              :mobile-cards="false">
              <b-table-column field="id" label="Course(s)" v-slot="props" :searchable="true">
                {{props.row.id}}
              </b-table-column>
              <b-table-column field="name" label="Name" v-slot="props" :searchable="true">
                {{props.row.name}}
              </b-table-column>
              <b-table-column field="units" label="Units" v-slot="props" :searchable="true">
                {{props.row.units}}
              </b-table-column>
              <b-table-column field="add" label="Add">
                <button class="button is-success" @click="onAddCourse($event)">
                  <span class="icon">
                    <i class="fas fa-plus"></i>
                  </span>
                </button>
              </b-table-column>
              <template slot="detail" slot-scope="props">
                <div class="content">
                  <p>
                      <strong>Course Description:</strong>
                      <br>
                      {{ props.row.description }}
                      <br><br>
                      <strong>Prerequisites:</strong>
                      {{ props.row.prereqs }}
                  </p>
                </div>
              </template>
            </b-table>
          </section>
          <div class="bg-image"></div>
        </div>
      </section>
    </div>
    <Footer />
  </section>
</template>

<script>
// @ is an alias to /src
import { mapState, mapActions } from 'vuex';
// import store from '@/store';
import Footer from '@/components/Footer.vue';
import Disclaimer from '@/components/Disclaimer.vue';

export default {
  name: 'Home',
  data: () => ({
    selected: '',
    defaultOpenedDetails: [1],
  }),
  async mounted() {
    await this.init();
  },
  computed: mapState('search', ['departments', 'results', 'courses']),
  methods: {
    ...mapActions('search', ['init', 'searchCourseItems', 'addCourseItem', 'deleteCourseItem']),
    async onSearchCourses() {
      await this.searchCourseItems(this.selected.value);
    },
    async onAddCourse(event) {
      await this.addCourseItem(event.path);
    },
    async onDeleteCourse(event) {
      await this.deleteCourseItem(event.path);
    },
  },
  components: {
    Disclaimer,
    Footer,
  },
};
</script>

<style lang="scss">
.home {
  position: relative;
  overflow: hidden;
}
.home:after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.05;
  background-image: url('../../public/images/misc-icons-bg.svg');
  background-repeat: repeat;
}
.p-1 {
  padding: 1em;
}
.p-2 {
  padding: 2em;
}
.sidebar-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  .sidebar-layout {
    display: flex;
    flex-direction: row;
    min-height: 100%;
  }
}
// .b-sidebar .sidebar-content {
//   width: 300px;
// }
@media screen and (max-width: 1023px) {
  .b-sidebar {
    .sidebar-content {
      &.is-mini-mobile {
        &:not(.is-mini-expand),
        &.is-mini-expand:not(:hover) {
          .added-list {
            display: none;
          }
          .is-bookmark {
            display: block;
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1024px) {
  .b-sidebar {
    .sidebar-content {
      &.is-mini {
        &:not(.is-mini-expand),
        &.is-mini-expand:not(:hover) {
          .added-list {
            display: none;
          }
          .is-bookmark {
            display: block;
          }
        }
    }
    }
  }
}
</style>
