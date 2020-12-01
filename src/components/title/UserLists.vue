<template>
  <v-menu v-if="$auth.loggedIn" :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-btn color="secondary" small v-on="on">
        <v-icon left>{{ buttonIcon }}</v-icon>
        {{ buttonText }}
      </v-btn>
    </template>
    <v-list flat>
      <v-list-item
        v-for="list in $auth.user.lists"
        :key="list.id"
        link
        :disabled="isLoading(list.id)"
        @click="toggleList(list.id)"
      >
        <v-list-item-action>
          <v-checkbox
            :input-value="isActive(list.id)"
            readonly
            color="primary"
          ></v-checkbox>
        </v-list-item-action>

        <v-list-item-content>
          <v-list-item-title>{{ list.name }}</v-list-item-title>
        </v-list-item-content>
        <v-fade-transition>
          <v-progress-circular
            v-show="isLoading(list.id)"
            indeterminate
            size="16"
            width="2"
          ></v-progress-circular>
        </v-fade-transition>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-btn v-else color="secondary" small @click="onNotAuthClick">
    <v-icon left>{{ buttonIcon }}</v-icon>
    {{ buttonText }}
  </v-btn>
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      buttonIcon: 'playlist_add',
      buttonText: this.$t('title.addToList'),
      activeUserLists: [],
    }
  },
  methods: {
    isLoading(listId) {
      return this.$wait.is([
        `user.addListTitle.${listId}`,
        `user.deleteListTitle.${listId}`,
      ])
    },
    onNotAuthClick() {
      this.$toast.error(this.$t('title.authToAddToList'), {
        queue: false,
      })
    },
    isActive(listId) {
      const listIndex = this.$auth.user.lists.findIndex(
        (list) => list.id === listId
      )

      if (listIndex !== undefined) {
        const listTitleIndex = this.$auth.user.lists[
          listIndex
        ].list_titles.findIndex(
          (listTitle) => listTitle.title.slug === this.title.slug
        )

        if (listIndex !== undefined) {
          return this.$auth.user.lists[listIndex].list_titles[listTitleIndex]
        }
      }

      return false
    },
    toggleList(listId) {
      const listTitle = this.isActive(listId)
      if (listTitle) {
        const listTitleId = listTitle.id
        this.$store
          .dispatch('user/deleteListTitle', {
            listId,
            listTitleId,
          })
          .catch((err) => {
            console.error(err)
          })
      } else {
        this.$store
          .dispatch('user/addListTitle', {
            listId,
            titleSlug: this.title.slug,
          })
          .catch((err) => {
            console.error(err)
          })
      }
    },
  },
}
</script>

<style></style>
