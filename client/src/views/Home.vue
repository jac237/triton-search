<template>
  <section class="home is-family-sans-serif has-text-centered">
    <div class="sidebar-page">
      <section class="sidebar-layout">
          <!-- SIDEBAR ADDED COURSES -->
        <b-sidebar
          v-if="notEmpty"
          position="static"
          mobile="reduce"
          expand-on-hover
          type="is-white"
          fullheight
          open>
          <div class="p-1 has-text-left" id="added-list" :data="courses">
            <div class="columns print-section">
              <div class="column">
                <button
                  class="button is-small is-info is-light"
                  @click="onPrintCourses">
                  PDF
                </button>
              </div>
            </div>
            <article
              class="media"
              v-for="course in courses"
              :key="course.id"
              :id="course.id">
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{ course.id }}</strong>
                    <br>
                    {{ course.name }}
                  </p>
                </div>
              </div>
              <div class="media-right">
                <a class="is-block" @click="onDeleteCourse(course)">
                  <span class="icon has-text-danger is-medium">
                    <i class="fas fa-times-circle fa-lg"></i>
                  </span>
                </a>
                <a class="is-block" @click="onDisplayInfo(course)">
                  <span class="icon has-text-info is-medium">
                    <i class="fas fa-info-circle fa-lg"></i>
                  </span>
                </a>
                <div class="name" style="display: none;">
                  {{ course.name }}
                </div>
                <div class="description" style="display: none;">
                  {{ course.description }}
                </div>
                <div class="prereqs" style="display: none;">
                  {{ course.prereqs }}
                </div>
              </div>
            </article>
          </div>
        </b-sidebar>

        <div class="sidebar-content">
          <Disclaimer class="p-2"/>
          <!-- SEARCH SELECTION FORM -->
          <div class="search-container">
            <div class="columns is-centered">
              <div class="column is-three-quarters">
                <!-- SEARCH FORM -->
                <form @submit.prevent="onSearchCourses" class="has-text-left">
                  <!-- AUTOCOMPLETE INPUT -->
                  <b-field id="autocomplete-search">
                    <b-autocomplete
                      v-model="search"
                      :data="filteredDepartments"
                      :open-on-focus="true"
                      :keep-first="true"
                      :clearable="true"
                      placeholder="Search by Department: e.g. CSE, Cognitive Science, Warren"
                      icon="magnify"
                      field="acronym"
                      :custom-formatter="searchLabel"
                      @select="option => (selected = option)"
                      expanded
                    >
                    </b-autocomplete>
                    <!-- SEARCH BUTTON -->
                    <button type="submit" class="button search-button is-info">Search</button>
                  </b-field>
                </form>
                <div class="form-label pt-2 is-centered">
                  Made with <i class="fas fa-heart has-text-danger"></i> using
                  <span class="has-text-weight-bold">Vue.js</span>,
                  <span class="has-text-weight-bold">Cloud Firestore</span>,
                  <span class="has-text-weight-bold">Buefy</span>, and
                  <span class="has-text-weight-bold">Bulma</span>.
                </div>
              </div>
            </div>
          </div>
          <!-- FEATURES -->
          <div class="container" v-if="typeof results[0] == 'undefined'">
            <Features />
          </div>
          <!-- SEARCH RESULTS TABLE -->
          <div
            class="container results-container has-text-left mb-5"
            v-if="typeof results[0] != 'undefined'">
            <!-- <label class="label">Results:</label> -->
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
              :mobile-cards="false"
            >
              <b-table-column field="id" label="Course(s)" v-slot="props" :searchable="true">
                {{props.row.id}}
              </b-table-column>
              <b-table-column field="name" label="Name" v-slot="props" :searchable="true">
                {{props.row.name}}
              </b-table-column>
              <b-table-column field="units" label="Units" v-slot="props" :searchable="true">
                {{props.row.units}}
              </b-table-column>
              <b-table-column field="add" label="" v-slot="props">
                <button
                  class="button is-small is-info"
                  style="border-radius: 50%"
                  @click="onAddCourse(props.row)"
                >
                  <span class="icon">
                    <i class="fas fa-plus"></i>
                  </span>
                </button>
              </b-table-column>
              <!-- COURSE INFO DROPDOWN CONTENT -->
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
          </div>
          <div class="bg-image"></div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import print from 'print-js';

import Disclaimer from '@/components/Disclaimer.vue';
import Features from '@/components/Features.vue';

export default {
  name: 'Home',
  components: {
    Disclaimer,
    Features,
  },
  data: () => ({
    search: '',
    selected: null,
    prevSearch: null,
    currPage: 1,
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
    notEmpty() {
      return Object.keys(this.courses).length !== 0;
    },
  },
  methods: {
    ...mapActions('search', [
      'init',
      'searchCourseItems',
      'addCourseItem',
      'deleteCourseItem',
    ]),
    searchLabel(option) {
      return `${option.acronym} - ${option.title}`;
    },
    onPageChange(page) {
      this.currPage = page;
    },
    onPrintCourses() {
      print({
        printable: Object.values(this.courses),
        properties: ['id', 'name', 'description', 'units', 'prereqs'],
        header: '<h3>COURSE DESCRIPTION(S)</h3>',
        type: 'json',
        style: 'th { text-align: left; } td { vertical-align: top; padding: 10px; }',
        gridStyle: 'border-bottom: 1px solid #ddd;',
      });
    },
    async onSearchCourses() {
      if (this.selected && this.selected !== this.prevSearch) {
        this.prevSearch = this.selected;
        this.$buefy.toast.open({
          message: `Searching <b>${this.selected.acronym}</b> department!`,
          type: 'is-black',
        });
        await this.searchCourseItems(this.selected.acronym);
        this.onPageChange(1);
      }
    },
    async onAddCourse(courseItem) {
      const courseId = courseItem.id;
      const isAdded = await this.addCourseItem(courseItem);
      if (isAdded) {
        this.$buefy.snackbar.open({
          duration: 900,
          message: `Course <b>${courseId}</b> Added!`,
          type: 'is-success',
        });
      } else {
        this.$buefy.snackbar.open({
          duration: 900,
          message: 'Already Added!',
          type: 'is-danger',
        });
      }
    },
    async onDeleteCourse(courseItem) {
      const id = await this.deleteCourseItem(courseItem.id);
      if (id) {
        this.$buefy.snackbar.open({
          duration: 900,
          message: `Course <b>${id}</b> Deleted!`,
          type: 'is-danger',
        });
      }
    },
    onDisplayInfo(courseItem) {
      // Get course item info by destructing object.
      const {
        id, name, description, prereqs,
      } = courseItem;

      const InfoModal = `
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">${id} / ${name}</p>
          </header>
          <section class="modal-card-body">
            <b>Description:</b> ${description}
            <hr width="75%">
            <b>Prerequisites:</b> ${prereqs}
          </section>
        </div>
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

.media-right {
  margin-left: 0.5rem;
}

.form-label {
  color: lightgray;
  font-size: 14px;
}

.search-container {
  background-color: #363636;
  padding-top: 3em;
  padding-bottom: 3em;
  margin-bottom: 2em;
}

.search-form {
  background-color: blue;
}

.search-button {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}

.results-container {
  padding-left: 1em;
  padding-right: 1em;
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
