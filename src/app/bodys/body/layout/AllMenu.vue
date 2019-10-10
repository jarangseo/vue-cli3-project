<template>
<div class="all_menu_section">
    <div class="inner_all_menu_section">
        <div class="all_menu_header">
            <span class="all_menu_title">All Menu</span>
            <div class="menu_page_nation">
                <ul>
                    <!-- [D] 선택된 페이지 넘버는 li에 on 클래스 추가 필요 -->
                    <li><a href="">1</a></li>
                    <li class="on"><a href="">2</a></li>
                    <li><a href="">3</a></li>
                </ul>
            </div>
            <a href="" class="btn_close_menu"><span class="blind">close</span></a>
        </div>
        <div class="all_menu_list">
            <div class="row_group">
                <ul>
                    <!--
                        [D] 카테고리 depth에 따라 li에 클래스 추가 필요
                            1) 최상위 카테고리 : top_category
                            2) 중위 카테고리 : middle_category
                            3) 최상위 - 중위 카테고리 사이 그룹 : group_category
                            * 실제 메뉴(최하위 메뉴명)는 li에 적용 클래스 없음.
                    -->
                    <li class="top_category">Category 01</li>
                    <li class="middle_category">Category 1</li>
                    <li><a href="">Tab2</a></li>
                    <li class="middle_category">Category 2</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab2</a></li>

                    <li class="top_category">Category 02</li>
                    <li class="middle_category">Category 1</li>
                    <li class="middle_category">Category 2</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab2</a></li>
                    <li><a href="">Tab3</a></li>
                    <li><a href="">Tab4</a></li>
                    <li><a href="">Tab5</a></li>
                    <li class="middle_category">Category 3</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab2</a></li>
                    <li><a href="">Tab3</a></li>
                </ul>
            </div>
            <div class="row_group">
                <ul>
                    <!--
                        [D] 카테고리 depth에 따라 li에 클래스 추가 필요
                            1) 최상위 카테고리 : top_category
                            2) 중위 카테고리 : middle_category
                            3) 최상위 - 중위 카테고리 사이 그룹 : group_category
                            * 실제 메뉴(최하위 메뉴명)는 li에 적용 클래스 없음.
                    -->
                    <li><a href="">Tab4</a></li>
                    <li><a href="">Tab5</a></li>
                    <li class="top_category">Category 03</li>
                    <li class="middle_category">Category 1</li>
                    <li><a href="">Tab2</a></li>
                    <li class="middle_category">Category 2</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab2</a></li>
                    <li class="middle_category">Category 3</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab2</a></li>
                    <li><a href="">Tab2</a></li>
                    <li class="top_category">Category 04</li>
                    <li class="middle_category">Category 1</li>
                    <li><a href="">Tab2</a></li>
                    <li class="middle_category">Category 2</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab2</a></li>
                </ul>
            </div>
            <div class="row_group">
                <ul>
                    <!--
                        [D] 카테고리 depth에 따라 li에 클래스 추가 필요
                            1) 최상위 카테고리 : top_category
                            2) 중위 카테고리 : middle_category
                            3) 최상위 - 중위 카테고리 사이 그룹 : group_category
                            * 실제 메뉴(최하위 메뉴명)는 li에 적용 클래스 없음.
                    -->
                    <li class="middle_category">Category 3</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab2</a></li>
                    <li class="top_category">Category 05</li>
                    <li class="group_category">Category Group a</li>
                    <li class="middle_category">Category 1</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab2</a></li>
                    <li><a href="">Tab3</a></li>
                    <li class="middle_category">Category 2</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab2</a></li>
                    <li class="group_category">Category Group b</li>
                    <li class="middle_category">Category 1</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab2</a></li>
                    <li><a href="">Tab3</a></li>
                    <li class="group_category">Category Group c</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab1</a></li>
                </ul>
            </div>
            <div class="row_group">
                <ul>
                    <!--
                        [D] 카테고리 depth에 따라 li에 클래스 추가 필요
                            1) 최상위 카테고리 : top_category
                            2) 중위 카테고리 : middle_category
                            3) 최상위 - 중위 카테고리 사이 그룹 : group_category
                            * 실제 메뉴(최하위 메뉴명)는 li에 적용 클래스 없음.
                    -->
                    <li class="group_category">Category Group d</li>
                    <li class="middle_category">Category 1</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab1</a></li>
                    <li class="top_category">Category 06</li>
                    <li class="group_category">Category Group a</li>
                    <li class="middle_category">Category 1</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab2</a></li>
                    <li><a href="">Tab3</a></li>
                    <li class="middle_category">Category 2</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab2</a></li>
                    <li class="group_category">Category Group b</li>
                    <li class="middle_category">Category 1</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab2</a></li>
                    <li class="middle_category">Category 2</li>
                    <li><a href="">Tab1</a></li>
                    <li><a href="">Tab2</a></li>
                </ul>
            </div>
        </div>
        <a href="" class="btn_before"><span class="blind">이전</span></a>
        <a href="" class="btn_next"><span class="blind">다음</span></a>
    </div>
</div>
</template>
<script>
export default {
  name: 'AllMenu'
}
</script>
