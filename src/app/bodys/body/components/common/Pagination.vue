<template>
  <div class="pagenation" v-if="pageInfo.totalPage > 1">
    <div class="pagenate">
      <ul>
        <!-- [D] 이동버튼 비활성화시 li에 a테그 삭제 필요 -->
        <li class="btn pre_start">
          <a @click="pageInfo.currentPage > 1 ? moveToTop() : () => {}">
            <span class="direction" :class="{ active: pageInfo.currentPage > 1}">
              <em class="blind">맨앞으로 이동</em>
            </span>
          </a>
        </li>
        <li class="btn pre">
          <a @click="pageInfo.currentPage > 1 ? move1Page('down') : () => {}">
            <span class="direction" :class="{ active: pageInfo.currentPage > 1}">
              <em class="blind">이전</em>
            </span>
          </a>
        </li>
        <!-- [D] 선택시 li에 selected 클래스 추가 필요 -->
        <li
          class="btn_num"
          :class="{ selected: pageInfo.currentPage === item }"
          v-for="(item, i) in numbers"
          :key="i"
          @click="changeOtherPage(item)"
        >
          <a>{{ item }}</a>
        </li>
        <!-- [D] 이동버튼 비활성화시 li에 a테그 삭제 필요 -->
        <li class="btn next">
          <a @click="pageInfo.currentPage < pageInfo.totalPage ? move1Page('up') : () => {}">
            <span class="direction" :class="{ active: pageInfo.currentPage < pageInfo.totalPage }">
              <em class="blind">다음</em>
            </span>
          </a>
        </li>
        <li class="btn next_end">
          <a @click="pageInfo.currentPage < pageInfo.totalPage ? moveToLast() : () => {}">
            <span class="direction" :class="{ active: pageInfo.currentPage < pageInfo.totalPage}">
              <em class="blind">맨뒤로 이동</em>
            </span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "Pagination",
  props: {
    pageInfo: {
      type: Object,
      default: () => {
        return {
          perPage: 10,
          totalCtn: 0,
          totalPage: 0,
          currentPage: 1,
          pageNumbers: []
        };
      }
    },
    moveTo: {
      type: Function,
      default: () => {}
    },
    changePage: {
      type: Function,
      default: () => {}
    },
    moveToFront: {
      type: Function,
      default: () => {}
    },
    moveToEnd: {
      type: Function,
      default: () => {}
    }
  },
  watch: {
    "pageInfo.totalPage" (d) {
      this.calcPage();
      this.$forceUpdate();
    }
  },
  data() {
    return {
      numbers: [],
      step: 3
    };
  },
  methods: {
    calcPage () {
      if (this.pageInfo.totalPage < this.step * 2 + 6) {
        this.makePageNumberArray(1, this.pageInfo.totalPage + 1);
      } else if (this.pageInfo.currentPage < this.step * 2 + 1) {
        this.makePageNumberArray(1, this.step * 2 + 5);
      } else if (
        this.pageInfo.currentPage >
        this.pageInfo.totalPage - this.step * 2
      ) {
        this.makePageNumberArray(
          this.pageInfo.totalPage - this.step * 2 - 2,
          this.pageInfo.totalPage + 1
        );
      } else {
        this.makePageNumberArray(
          this.pageInfo.currentPage - this.step - 2,
          this.pageInfo.currentPage + this.step + 2
        );
      }
    },
    makePageNumberArray (s, f) {
      this.numbers = []
      for (let i = s; i < f; i++) {
        this.numbers.push(i)
      }
    },
    changeOtherPage (item) {
      this.changePage(item)
      this.calcPage()
    },
    moveToTop () {
      this.moveToFront()
      this.calcPage()
    },
    moveToLast () {
      this.moveToEnd()
      this.calcPage()
    },
    move1Page (type) {
      this.moveTo(type)
      this.calcPage()
    }
  },
  mounted () {
    this.calcPage()
  }
};
</script>
<style lang="scss">
/*.next_end a .direction:before {
  color: #e8e8e8 !important;
}
.next_end a .direction.active:before {
  color: #9e9e9e !important;
}
.next a .direction:before {
  color: #e8e8e8 !important;
}
.next a .direction.active:before {
  color: #9e9e9e !important;
}
.pre a .direction:before {
  color: #e8e8e8 !important;
}
.pre a .direction.active:before {
  color: #9e9e9e !important;
}
.pre_start a .direction:before {
  color: #e8e8e8 !important;
}
.pre_start a .direction.active:before {
  color: #9e9e9e !important;
}*/
</style>
