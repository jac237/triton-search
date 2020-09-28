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
          type="is-white"
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
                <button class="button is-danger mb-2" @click="onDeleteCourse($event)">
                  <span class="icon is-small">
                    <i class="fas fa-trash"></i>
                  </span>
                </button>
                <button class="button is-info" @click="onDisplayInfo($event)">
                  <span class="icon is-small">
                    <i class="fas fa-info"></i>
                  </span>
                </button>
              </div>
              <div class="description" style="display: none;">
                {{ course.description }}
              </div>
              <div class="prereqs" style="display: none;">
                {{ course.prereqs }}
              </div>
            </div>
          </div>
        </b-sidebar>
        <div class="p-2" style="flex-grow: 1; padding-left:5%; padding-right:5%">
          <Disclaimer />
          <!-- SEARCH SELECTION -->
          <section class="search has-text-left mb-5">
            <form @submit.prevent="onSearchCourses">
              <!-- <b-field
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
              </b-field> -->
              <b-field label="Search by Department:">
                <b-autocomplete
                  v-model="search"
                  :data="filteredDepartments"
                  :open-on-focus="true"
                  :keep-first="true"
                  :clearable="true"
                  placeholder="e.g. CSE, COGS, BIOL"
                  icon="magnify"
                  field="acronym"
                  :custom-formatter="searchLabel"
                  @select="option => (selected = option)"
                  expanded
                >
                </b-autocomplete>
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
      <Footer />
    </div>
  </section>
</template>

<script>
// @ is an alias to /src
import { mapState, mapActions } from 'vuex';
// Import components
import Footer from '@/components/Footer.vue';
import Disclaimer from '@/components/Disclaimer.vue';

export default {
  name: 'Home',
  data: () => ({
    search: '',
    selected: null,
    prevSearch: null,
    defaultOpenedDetails: [1],
  }),
  async mounted() {
    await this.init();
  },
  computed: {
    ...mapState('search', ['departments', 'results', 'courses']),
    filteredDepartments() {
      return this.departments.filter((department) => {
        const label = this.searchLabel(department).toLowerCase();
        return label.indexOf(this.search.toLowerCase()) >= 0;
      });
    },
  },
  methods: {
    ...mapActions('search', ['init', 'searchCourseItems', 'addCourseItem', 'deleteCourseItem']),
    searchLabel(option) {
      return `${option.acronym} - ${option.title}`;
    },
    async onSearchCourses() {
      if (this.selected && this.selected !== this.prevSearch) {
        this.prevSearch = this.selected;
        this.$buefy.toast.open({
          message: `Searching <b>${this.selected.acronym}</b> department!`,
          type: 'is-black',
        });
        await this.searchCourseItems(this.selected.acronym);
      }
    },
    async onAddCourse(event) {
      const id = await this.addCourseItem(event.path);
      if (id) {
        this.$buefy.snackbar.open({
          duration: 900,
          message: `Course ${id} Added!`,
          type: 'is-success',
          queue: 'false',
        });
      }
    },
    async onDeleteCourse(event) {
      const id = await this.deleteCourseItem(event.path);
      if (id) {
        this.$buefy.snackbar.open({
          duration: 900,
          message: `Course ${id} Deleted!`,
          type: 'is-danger',
          queue: 'false',
        });
      }
    },
    onDisplayInfo(event) {
      const div = event.path.find((element) => element.className === 'columns');
      const id = div.getAttribute('id');
      const description = div.querySelector('.description').innerHTML;
      const prereqs = div.querySelector('.prereqs').innerHTML;
      const InfoModal = `
        <form action="">
          <div class="modal-card" style="width: auto">
            <header class="modal-card-head">
              <p class="modal-card-title">${id}</p>
            </header>
            <section class="modal-card-body">
              <b>Description:</b> ${description}
              <hr width="75%">
              <b>Prerequisites:</b> ${prereqs}
            </section>
          </div>
        </form>
      `;
      this.$buefy.modal.open({
        parent: this,
        content: InfoModal,
        hasModalCard: true,
        customClass: 'info-modal',
        trapFocus: true,
      });
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
