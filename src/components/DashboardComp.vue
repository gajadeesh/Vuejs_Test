<template>
  <v-app>
    <v-container>
      <v-layout text-center wrap>
        <v-layout align-center justify-center>
          <v-flex md8 sm12>
            <v-layout row wrap>
              <v-layout column px-2>
                <v-select
                  color="white"
                  :items="Sectionitems"
                  v-model="SectionSelected"
                  label="Select Section"
                ></v-select>
              </v-layout>
              <v-layout column px-2>
                <v-select
                  color="white"
                  :items="Fieldsitems"
                  v-model="FieldSelected"
                  label="Select Field"
                  clearable
                ></v-select>
                <v-checkbox label="Empty Value" v-if="FieldSelected" v-model="Evalue"></v-checkbox>
              </v-layout>
            </v-layout>
            <v-layout row wrap>
              <v-flex md12>
                <!-- <p class="error--text">press enter to search!...</p> -->
                <v-text-field
                  v-model="search"
                  :disabled="Evalue"
                  label="Press enter to search..."
                  color="white"
                  @keyup.enter="searchCheck"
                  outlined
                  pa-2
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-container>
    <v-layout align-center justify-center>
      <v-flex md6>
        <!-- {{STickets}} -->
        <v-simple-table v-if="SectionSelected == 'Tickets' && !FieldSelected && !HideMain">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="warning--text">
                  <h3>Organization name : {{FOrg.find(f => f._id == STickets.organization_id).name}}</h3>
                </th>
              </tr>
              <tr>
                <th>Asignee Name</th>
                <th>Submitted Name</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{FUsers.find(u => u._id == STickets.assignee_id).name}}</td>
                <td>{{FUsers.find(u => u._id == STickets.submitter_id).name}}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>

        <v-simple-table v-if="SectionSelected == 'Users' && !FieldSelected && !HideMain">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="warning--text">
                  <h3>Organization name : {{FOrg.find(f => f._id == SUOrgID).name}}</h3>
                </th>
              </tr>
              <tr>
                <th>Asignee Tickets</th>
                <th>Submitted Ticktes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <ul v-for="ST in SUAssignee" :key="ST.id">
                    <li>{{ST.subject}}</li>
                  </ul>
                </td>
                <td>
                  <ul v-for="ST in SUSubmitter" :key="ST.id">
                    <li>{{ST.subject}}</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-flex>
    </v-layout>
    <v-flex md12 px-5>
      <v-simple-table v-if="SectionSelected == 'Organizations' && !FieldSelected && !HideMain">
        <template v-slot:default>
          <thead>
            <tr>
              <th>Subject</th>
              <td>User</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ST in SOraganizations" :key="ST.id">
              <td>{{ST.subject}}</td>
              <td>{{FUsers.find(r => r._id == ST.submitter_id).name}}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <v-simple-table v-if="SectionSelected && HideMain">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left" v-for="th in Fieldsitems" :key="th.id">{{th}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in resultSection" :key="item.name">
              <td v-for="th in Fieldsitems" :key="th.id">
                <div v-if="listStuffs.includes(th)" py-2>
                  <ul v-for="ls in item[th]" :key="ls.id">
                    <li>{{ls}}</li>
                  </ul>
                </div>
                <div v-else>{{ item[th] }}</div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <!-- {{resultFieldSection}} -->
      <v-simple-table v-if="FieldSelected && resultFieldSection.length">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left" v-for="th in Fieldsitems" :key="th.id">{{th}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in resultFieldSection" :key="item.name">
              <td v-for="th in Fieldsitems" :key="th.id">
                <div v-if="listStuffs.includes(th)" py-2>
                  <ul v-for="ls in item[th]" :key="ls.id">
                    <li>{{ls}}</li>
                  </ul>
                </div>
                <div v-else>{{ item[th] }}</div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-flex>
  </v-app>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      Organizations: [],
      search: "",
      HideMain: false,
      Evalue: false,
      Sectionitems: ["Organizations", "Users", "Tickets"],
      Fieldsitems: [],
      resultSection: [],
      resultFieldSection: [],
      FieldSelected: "",
      SectionSelected: "",
      SOraganizations: [],
      SUser: [],
      STickets: [],
      SUAssignee: [],
      SUSubmitter: [],

      SUOrgID: 0,
      STOrgId: 0,
      FUsers: [],
      FOrg: [],
      ignoreStuffs: [
        "created_at",
        "external_id",
        "due_at",
        "submitter_id",
        "url",
        "assignee_id",
        "shared_tickets",
        "shared",
        "verified",
        "last_login_at",
        "suspended",
        "organization_id",
        "_id",
        "has_incidents"
      ],
      listStuffs: ["tags", "domain_names"]
    };
  },
  created() {
    // this.UsersFilter;
  },
  watch: {
    SectionSelected: function(val) {
      this.fields(val);
    },
    // search: function(val) {
    //   if (this.SectionSelected && this.FieldSelected) {
    //     this.FieldSearchFilter(val);
    //   } else if (this.SectionSelected) {
    //     this.SearchFilter(val);
    //   }
    // },
    FieldSelected: function(e) {
      if (!e) {
        this.fields(this.SectionSelected);
        this.Evalue = false;
      }
    },
    Evalue: function(e) {
      if (e) {
        this.EmptySearchFilter(e);
      } else {
        this.fields(this.SectionSelected);
      }
    }
  },
  computed: {
    UsersFilter: function() {
      axios.get(`json/users.json`).then(res => {
        this.FUsers = res.data;
      });
    },
    OrganizationsFilter: function() {
      axios.get(`json/organizations.json`).then(res => {
        this.FOrg = res.data;
      });
    }
  },
  methods: {
    searchCheck: function() {
      if (this.SectionSelected && this.FieldSelected) {
        this.FieldSearchFilter(this.search);
      } else if (this.SectionSelected) {
        this.SearchFilter(this.search);
      }
    },
    fields: function(e) {
      const vm = this;

      axios.get(`json/${e}.json`).then(res => {
        const result = res.data.find(r => r);
        const rs = Object.keys(result);
        vm.Fieldsitems = rs;
        if (!vm.search) {
          vm.resultSection = res.data;
          vm.HideMain = true;
        }
      });
      // }
    },
    EmptySearchFilter: function(e) {
      // console.log(e)
      const fs = this.FieldSelected;
      const FSresult = this.resultSection.filter(r => {
        return r[fs] == "" || r[fs] == null;
      });
      // console.log(FSresult)
      this.resultSection = FSresult;
    },
    FieldSearchFilter: function(e) {
      e ? (this.HideMain = false) : (this.HideMain = true);
      const fs = this.FieldSelected;
      const FSresult = this.resultSection.filter(r => {
        return r[fs] == e;
      });
      // console.log(FSresult)
      this.resultFieldSection = FSresult;
    },
    SearchFilter: function(e) {
      e ? (this.HideMain = false) : (this.HideMain = true);
      if (this.SectionSelected == "Organizations") {
        const Sresult = this.resultSection.find(r => r._id == e);
        // console.log(Sresult);

        const OrgId = Sresult._id;
        this.Org(OrgId);
      } else if (this.SectionSelected == "Users") {
        const Sresult = this.resultSection.find(r => r.name == e);
        const UsrId = Sresult._id;
        const UserName = Sresult.name;
        const OrganizationId = Sresult.organization_id;
        this.Usr(UsrId, UserName, OrganizationId);
      } else if (this.SectionSelected == "Tickets") {
        this.STickets = this.resultSection.find(r => r.subject == e);
        this.UsersFilter;
        this.OrganizationsFilter;
      } else {
      }
    },

    Org: function(e) {
      this.UsersFilter;
      axios.get(`json/tickets.json`).then(res => {
        this.SOraganizations = res.data.filter(r => r.organization_id == e);
      });
    },
    Tic: function(Tid, Oid, Aid, Sid) {
      axios.get(`json/tickets.json`).then(res => {
        this.STickets = res.data.filter(r => r.organization_id == e);
      });
    },
    Usr: function(Uid, UserName, Oid) {
      this.OrganizationsFilter;
      axios.get(`json/tickets.json`).then(res => {
        const ask = res.data.filter(r => r.assignee_id == Uid);
        const su = res.data.filter(r => r.submitter_id == Uid);

        this.SUAssignee = res.data.filter(r => r.assignee_id == Uid);
        this.SUSubmitter = res.data.filter(r => r.submitter_id == Uid);
        this.SUOrgID = Oid;
      });
    }
  }
};
</script>
