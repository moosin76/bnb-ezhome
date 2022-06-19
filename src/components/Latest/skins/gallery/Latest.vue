<template>
  <v-card>
    <v-card-title>
      {{ subject }}
      <v-spacer />
      <v-btn :to="`/board/${table}`" fab x-small>
        <v-icon>mdi-dots-horizontal</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider />
    <v-container fluid>
      <v-row>
        <v-col
          class="mt-4 gal-item"
          cols="6"
          sm="6"
          md="4"
          lg="2"
          v-for="(item, idx) in items"
          :key="item.wr_id"
        >
          <v-card style="color: white; background-color: #444">
            <v-card-title class="px-0 mx-4 text-body-1">
              <span
                style="
                  width: 100%;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  white-space: nowrap;
                "
              >
                {{ item.wr_title }}
              </span>
            </v-card-title>
            <v-card-subtitle class="d-flex pb-2" style="color: white">
              
							<div style="color: white">
                <v-icon color="white" small>mdi-eye</v-icon>
                {{ item.wr_view }}
                <v-icon color="white" small claFss="ml-2">
                  mdi-comment-outline
                </v-icon>
                {{ item.wr_reply }}
              </div>

              <v-spacer />
              <display-time :time="item.wr_createat" />
            </v-card-subtitle>
            <a
              @click="$router.push(`/board/${table}/${item.wr_id}`)"
              class="text-decoration-none"
            >
              <v-img :src="getImage(table, item, imgSize)" :aspect-ratio="1">
              </v-img>
            </a>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import DisplayTime from "../../../layout/DisplayTime.vue";
import { getImage } from "../../../../../util/lib";
export default {
  components: { DisplayTime },
  name: "Latest",
  props: {
    table: { type: String, required: true },
    subject: { type: String, required: true },
    items: { type: Array, required: true },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      imgSize: {
        w: 300,
        h: 300,
      },
    };
  },
  computed: {
    getImage: () => getImage,
  },
};
</script>

<style>
</style>