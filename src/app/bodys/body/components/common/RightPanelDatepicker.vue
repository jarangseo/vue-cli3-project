<template>
  <div class="set_layer start_end_date" style="display:none">
    <div class="setting_group">
      <div class="set_first">
        <div class="calendar_area">
          <div class="month_calendar">
            <div class="year_month">
              <span class="year">2018</span>.<span class="monfth">09</span>
            </div>
            <a href="" class="btn_go pre_year"><span class="blind">지난 해 (last year)</span></a>
            <a href="" class="btn_go pre_month"><span class="blind">지난 달 (last month)</span></a>
            <a href="" class="btn_go next_month"><span class="blind">다음 달 (next month)</span></a>
            <a href="" class="btn_go next_year"><span class="blind">다음 해 (next year)</span></a>
            <table cellspacing="0" cellpadding="0" border="0" summary="" class="tbl_calendar">
              <caption>월력</caption>
              <colgroup>
                <col>
              </colgroup>
              <thead>
              <tr>
                <th scope="col" class="sun"><span>S</span></th>
                <th scope="col"><span>M</span></th>
                <th scope="col"><span>T</span></th>
                <th scope="col"><span>W</span></th>
                <th scope="col"><span>T</span></th>
                <th scope="col"><span>F</span></th>
                <th scope="col" class="sat"><span>S</span></th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                <!-- [D] 날짜가 지난경우 a에 hide_link 클래스 추가 필요 -->
                <td class="sun"><a href="" class="hide_link"><span class="day">26</span></a></td>
                <td><a href="" class="hide_link"><span class="day">27</span></a></td>
                <td><a href="" class="hide_link"><span class="day">28</span></a></td>
                <td><a href="" class="hide_link"><span class="day">29</span></a></td>
                <td><a href="" class="hide_link"><span class="day">30</span></a></td>
                <td><a href="" class="hide_link"><span class="day">31</span></a></td>
                <td class="sat"><a href=""><span class="day">1</span></a></td>
              </tr>
              <tr>
                <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                <td class="sun"><a href=""><span class="day">2</span></a></td>
                <td><a href=""><span class="day">3</span></a></td>
                <td><a href=""><span class="day">4</span></a></td>
                <td><a href=""><span class="day">5</span></a></td>
                <td><a href=""><span class="day">6</span></a></td>
                <td><a href=""><span class="day">7</span></a></td>
                <td class="sat"><a href=""><span class="day">8</span></a></td>
              </tr>
              <tr>
                <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                <td class="sun"><a href=""><span class="day">9</span></a></td>
                <td><a href=""><span class="day">10</span></a></td>
                <td><a href=""><span class="day">11</span></a></td>
                <td><a href=""><span class="day">12</span></a></td>
                <td><a href=""><span class="day">13</span></a></td>
                <td><a href=""><span class="day">14</span></a></td>
                <td class="sat"><a href=""><span class="day">15</span></a></td>
              </tr>
              <tr>
                <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                <td class="sun"><a href=""><span class="day">16</span></a></td>
                <td><a href="" class="select"><span class="day">17</span></a></td>
                <td><a href=""><span class="day">18</span></a></td>
                <td><a href=""><span class="day">19</span></a></td>
                <td><a href=""><span class="day">20</span></a></td>
                <td><a href=""><span class="day">21</span></a></td>
                <td class="sat"><a href=""><span class="day">22</span></a></td>
              </tr>
              <tr>
                <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                <td class="sun"><a href=""><span class="day">23</span></a></td>
                <td><a href=""><span class="day">24</span></a></td>
                <td><a href=""><span class="day">25</span></a></td>
                <!-- [D] 휴일 및 공휴일의 경우 holiday 클래스 추가 필요 -->
                <td class="holiday"><span class="day">26</span></td>
                <td><span class="day">27</span></td>
                <td><span class="day">28</span></td>
                <td class="sat"><span class="day">29</span></td>
              </tr>
              <tr>
                <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                <td class="sun"><span class="day">30</span></td>
                <td><span class="day">31</span></td>
                <td><span class="day">1</span></td>
                <td><span class="day">2</span></td>
                <td><span class="day">3</span></td>
                <td><span class="day">4</span></td>
                <td class="sat"><span class="day">5</span></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="set_second">
        <div class="calendar_area">
          <div class="month_calendar">
            <div class="year_month">
              <span class="year">2018</span>.<span class="monfth">09</span>
            </div>
            <a href="" class="btn_go pre_year"><span class="blind">지난 해 (last year)</span></a>
            <a href="" class="btn_go pre_month"><span class="blind">지난 달 (last month)</span></a>
            <a href="" class="btn_go next_month"><span class="blind">다음 달 (next month)</span></a>
            <a href="" class="btn_go next_year"><span class="blind">다음 해 (next year)</span></a>
            <table cellspacing="0" cellpadding="0" border="0" summary="" class="tbl_calendar">
              <caption>월력</caption>
              <colgroup>
                <col>
              </colgroup>
              <thead>
              <tr>
                <th scope="col" class="sun"><span>S</span></th>
                <th scope="col"><span>M</span></th>
                <th scope="col"><span>T</span></th>
                <th scope="col"><span>W</span></th>
                <th scope="col"><span>T</span></th>
                <th scope="col"><span>F</span></th>
                <th scope="col" class="sat"><span>S</span></th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                <!-- [D] 날짜가 지난경우 a에 hide_link 클래스 추가 필요 -->
                <td class="sun"><a href="" class="hide_link"><span class="day">26</span></a></td>
                <td><a href="" class="hide_link"><span class="day">27</span></a></td>
                <td><a href="" class="hide_link"><span class="day">28</span></a></td>
                <td><a href="" class="hide_link"><span class="day">29</span></a></td>
                <td><a href="" class="hide_link"><span class="day">30</span></a></td>
                <td><a href="" class="hide_link"><span class="day">31</span></a></td>
                <td class="sat"><a href=""><span class="day">1</span></a></td>
              </tr>
              <tr>
                <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                <td class="sun"><a href=""><span class="day">2</span></a></td>
                <td><a href=""><span class="day">3</span></a></td>
                <td><a href=""><span class="day">4</span></a></td>
                <td><a href=""><span class="day">5</span></a></td>
                <td><a href=""><span class="day">6</span></a></td>
                <td><a href=""><span class="day">7</span></a></td>
                <td class="sat"><a href=""><span class="day">8</span></a></td>
              </tr>
              <tr>
                <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                <td class="sun"><a href=""><span class="day">9</span></a></td>
                <td><a href=""><span class="day">10</span></a></td>
                <td><a href=""><span class="day">11</span></a></td>
                <td><a href=""><span class="day">12</span></a></td>
                <td><a href=""><span class="day">13</span></a></td>
                <td><a href=""><span class="day">14</span></a></td>
                <td class="sat"><a href=""><span class="day">15</span></a></td>
              </tr>
              <tr>
                <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                <td class="sun"><a href=""><span class="day">16</span></a></td>
                <td><a href="" class="select"><span class="day">17</span></a></td>
                <td><a href=""><span class="day">18</span></a></td>
                <td><a href=""><span class="day">19</span></a></td>
                <td><a href=""><span class="day">20</span></a></td>
                <td><a href=""><span class="day">21</span></a></td>
                <td class="sat"><a href=""><span class="day">22</span></a></td>
              </tr>
              <tr>
                <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                <td class="sun"><a href=""><span class="day">23</span></a></td>
                <td><a href=""><span class="day">24</span></a></td>
                <td><a href=""><span class="day">25</span></a></td>
                <!-- [D] 휴일 및 공휴일의 경우 holiday 클래스 추가 필요 -->
                <td class="holiday"><a href=""><span class="day">26</span></a></td>
                <td><a href=""><span class="day">27</span></a></td>
                <td><a href=""><span class="day">28</span></a></td>
                <td class="sat"><a href=""><span class="day">29</span></a></td>
              </tr>
              <tr>
                <!-- [D] 날짜가 선택되었을 경우 a에 select 클래스 추가 필요 -->
                <td class="sun"><a href=""><span class="day">30</span></a></td>
                <td><a href=""><span class="day">31</span></a></td>
                <td><span class="day">1</span></td>
                <td><span class="day">2</span></td>
                <td><span class="day">3</span></td>
                <td><span class="day">4</span></td>
                <td class="sat"><span class="day">5</span></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="set_third">
        <div class="inner_date_set">
          <dl>
            <dt>From</dt>
            <dd><input type="text" class="set_date_val" value="2018-09-03, 13:30" readonly="readonly"></dd>
          </dl>
          <dl>
            <dt>To</dt>
            <dd><input type="text" class="set_date_val" value="2018-09-21, 20:00" readonly="readonly"></dd>
          </dl>
        </div>
      </div>
    </div>
    <div class="btn_group">
      <div class="action_btn">
        <a href="" class="btn cancel">CANCEL</a>
        <a href="" class="btn apply">APPLY</a>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RightPanelDatepicker'
}
</script>
