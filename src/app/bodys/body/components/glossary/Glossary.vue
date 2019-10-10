<template>
  <!--  팝업 (1100x770) -->
  <div id="pop_wrap" class="pop_wrap" style="height: 856px;width: 1118px;">
    <div class="pop_container">
      <h1>Glossary</h1>
      <div class="popup_menu">
        <ul>
          <!-- [D] 메뉴 선택시 li에 on 추가 필요 -->
          <li v-for="item in _glossaryInitCode" :class="{ on : currentGroupName === item }">
            <a href="#" @click.prevent="() => { currentGroupName = item; getGlossaryList(item) }" class="btn_menu">{{ item }}</a>
          </li>
        </ul>
      </div>
      <div class="popup_contents">
        <div class="index_list" style="min-height: 60px;">
          <ul>
            <!-- [D] 메뉴 선택시 li에 on 추가 필요 -->
            <li v-for="(item, index) in _alphabetList" :key="index" :class="{ on : currentAlphabet === item }">
              <a :href="`#${item}`" @click="() => { currentAlphabet = item }" class="btn_index_group">{{ item }}</a>
            </li>
          </ul>
        </div>
        <div class="index_list_detail">
          <div class="index_list_group">
            <ul>
              <!-- [D] 선택시 li에 on 추가 필요 -->
              <template v-for="item in _glossaryList">
                <li><a :name="item.alphabet"><span class="group_title">{{ item.alphabet }}</span></a></li>
                <template v-for="item2 in item.glossary">
                  <li :class="{  on : currentGlossaryId === item2.id }">
                    <a href="#" @click.prevent="() => { currentGlossaryId = item2.id; detailGlossary(item2.id) }">{{ item2.name }}</a>
                  </li>
                </template>
              </template>
            </ul>
          </div>
          <div class="index_detail_info" v-if="glossaryInfo">
            <div class="inner_detail_info">
              <h2>{{ glossaryInfo.name }}</h2>
              <p>{{ glossaryInfo.tooltip }}</p>
              <div class="quillWrapper">
                <div class="ql-container ql-snow" style="border: none;">
                  <p class="ql-editor" v-html="glossaryInfo.description"></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import * as types from '@/shared/stores/types'
import _ from 'lodash'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

export default {
  name: 'Glossary',
  data () {
    return {
      currentGroupName: '',
      currentAlphabet: '',
      currentGlossaryId: '',
      glossaryInfo: {
        id: null,
        name: '',
        tooltip: '',
        description: ''
      },
      window: {
        width: 0,
        height: 0
      }
    }
  },
  watch: {
    _glossaryInitCode (d) {
      this.currentGroupName = d ? d[0] : ''
      if (this.currentGroupName) {
        this.getGlossaryList(this.currentGroupName)
      }
    },
    _glossaryList (d) {
      let first = false
      for (let i = 0; i < d.length; i++) {
        for (let j = 0; j < d[i].glossary.length; j++) {
          if (!first) {
            first = true
            this.currentGlossaryId = d[i].glossary[j].id
            this.detailGlossary(this.currentGlossaryId)
          }
        }
      }
    },
    _alphabetList (d) {
      this.currentAlphabet = d ? d[0] : ''
    },
    _glossaryInfo (d) {
      this.glossaryInfo = _.cloneDeep(d)
    },
    _resizeWindow () {
      this.handleResize()
    }
  },
  components: {
  },
  computed: {
    ...mapState({
      _glossaryList: state => state.glossary._glossaryList,
      _alphabetList: state => state.glossary._alphabetList,
      _glossaryInitCode: state => state.glossary._glossaryInitCode,
      _glossaryInfo: state => state.glossary._glossaryInfo,
      _resizeWindow: state => state.report._resizeWindow
    })
  },
  methods: {
    getGlossaryList (type) {
      this.initGlossaryInfo()
      this.$store.dispatch(types.GET_GLOSSARY_LIST, type)
    },
    getGlossaryInitCodes () {
      this.$store.dispatch(types.GET_GLOSSARY_INIT_CODES)
    },
    detailGlossary (id) {
      this.initGlossaryInfo()
      this.$store.dispatch(types.GET_GLOSSARY, id)
    },
    initGlossaryInfo () {
      this.glossaryInfo = {
        id: null,
        name: '',
        tooltip: '',
        description: ''
      }
    },
    handleResize () {
      this.window.width = 1135
      this.window.height = 920
      window.resizeTo(this.window.width, this.window.height)
    }
  },
  created () {
    this.getGlossaryInitCodes()
    this.handleResize()
  }
}
</script>
<style lang="scss">
  .pop_wrap .pop_container .popup_contents .index_list_detail .index_detail_info .inner_detail_info p {
    line-height: 1.42 !important;
    margin-bottom: 0px !important;
  }
  .ql-editor p, .ql-editor em, .ql-editor u {
    color: #212121 !important;
  }
  .ql-editor pre {
    font-family: monospace !important;
  }
  .ql-container {
    font-size: 14px !important;
  }
</style>
