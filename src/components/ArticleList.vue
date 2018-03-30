<template>
  <div>
    <v-card v-for="article in articles" :key="article.id" class="article">
      <v-card-title>
        <div>
          <h3 class="headline mb-0">{{ article.title }}</h3>
          <div>{{ article.body | short }}...</div>
        </div>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn icon v-if="$can('update', article)">
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn icon v-if="$can('delete', article)">
          <v-icon>delete</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>share</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    data() {
      return {
        articles: []
      }
    },
    methods: {
      ...mapActions(['getArticles'])
    },
    created() {
      this.getArticles()
        .then(articles => this.articles = articles)
        .catch(error => this.notity({ message: error.message, type: 'error' }))
    },
    filters: {
      short(value) {
        return value.slice(0, 50)
      }
    }
  }
</script>

<style scoped lang="scss">
  .article {
    margin-bottom: 20px;
  }
</style>
