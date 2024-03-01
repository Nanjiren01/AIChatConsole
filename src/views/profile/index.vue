<template>
  <div class="app-container">
    <div>
      <el-row :gutter="20" type="flex" justify="center">

        <el-col :lg="12" :md="24">
          <user-card :user="user" />
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
// import Activity from './components/Activity'
// import Timeline from './components/Timeline'
// import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard }, // , Activity, Timeline, Account
  data() {
    return {
      // user: {},
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'user'
    ])
  },
  created() {
    // this.getUser()
  },
  methods: {
    // getUser() {
    //   this.user = {
    //     name: this.name,
    //     role: this.roles.join(' | '),
    //     email: 'admin@test.com',
    //     avatar: this.avatar
    //   }
    // }
  }
}
</script>
