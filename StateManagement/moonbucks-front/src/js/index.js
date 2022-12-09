/**
 * 요구사항 구현을 위한 전략
 * step1
 * 메뉴 추가
 * - [x] input으로 메뉴 이름을 입력 받는다.
 * - [x] 확인 버튼을 누르면 메뉴를 추가한다.
 * - [x] 엔터키를 누르면 메뉴를 추가한다.
 * - [x] 단, 입력값이 빈 값이면 추가하지 않는다.
 * - [x] 메뉴 추가 후 input 값은 빈 값으로 초기화한다.
 * - [x] 추가한 메뉴 마크업은 `<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>` 안에 삽입한다.
 * - [x] 변경된 총 메뉴 갯수를 상단에 출력한다.
 * 메뉴 수정
 * - [x] 수정 버튼을 누르면 수정 prompt 창을 출력한다.
 * - [x] prompt 창은 브라우저 prompt 인터페이스를 이용한다.
 * 메뉴 삭제
 * - [x] 삭제 버튼을 누르면 삭제 확인 confirm 창을 출력한다.
 * - [x] confirm 창은 브라우저 confirm 인터페이스를 이용한다.
 * - [x] 변경된 총 메뉴 갯수를 상단에 출력한다.
 *
 * step2
 * LocalStorage 데이터 저장 및 조회
 * - [x] localStorage에 데이터를 저장한다.
 *  - [x] 메뉴를 추가할 때
 *  - [x] 메뉴를 수정할 때
 *  - [x] 메뉴를 삭제할 때
 * - [x] localStorage의 데이터를 읽어온다.
 * 종류 별 메뉴판 관리
 * - [x] 에스프레소 메뉴판 관리
 * - [x] 프라푸치노 메뉴판 관리
 * - [x] 블렌디드 메뉴판 관리
 * - [x] 티바나 메뉴판 관리
 * - [x] 디저트 메뉴판 관리
 * 초기값
 * - [x] 페이지에 최초로 접근할 때 localStorage에서 에스프레소 메뉴를 읽어온다.
 * - [x] 불러온 에스프레소 메뉴를 출력한다.
 * 품절
 * - [x] 품절 버튼을 추가한다.
 * - [x] 품절 버튼을 누르면 상태값을 localStorage에 저장한다.
 * - [x] 품절 버튼을 누르면 가장 가까운 부모 li 태그에 sold-out class를 추가한다.
 *
 * step3
 * 서버 요청
 *  - [x] 링크에 있는 웹 서버 저장소를 clone한다.
 *  - [x] 로컬에서 웹 서버를 실행한다.
 *  - [x] 데이터 관리를 localStroage에서 웹 서버로 변경한다.
 *    - [x] 웹 서버로 데이터 요청할 때 fetch API를 이용한다.
 *    - [x] fetch api 로직은 async, await을 사용하여 구현한다.
 *    - [x] 웹 서버에 카테고리별 메뉴 목록을 요청한다. GET	/api/category/:category/menu
 *    - [x] 웹 서버에 메뉴 추가를 요청한다. POST	/api/category/:category/menu
 *    - [x]] 웹 서버에 메뉴 수정을 요청한다. PUT	/api/category/:category/menu/:menuId
 *    - [x] 웹 서버에 메뉴 삭제를 요청한다. DELETE	/api/category/:category/menu/:menuId
 *    - [x] 웹 서버에 메뉴 품절 상태 toggle을 요청한다. PUT	/api/category/:category/menu/:menuId/soldout
 * 리팩토링
 *  - [x] localStorage에 저장하는 로직은 지운다.
 * 사용자 경험
 *  - [x] 중복되는 메뉴는 추가할 수 없다.
 *    - [x] 입력값이 기존 메뉴 이름과 중복되는지 확인한다.
 *    - [x] 중복되는 경우 추가, 수정 요청을 보내지 않는다.
 *  - [x] API 통신이 실패하는 경우 alert으로 예외처리를 진행한다.
 */

import { $ } from "./utils/dom.js";
import MenuApi from "./api/index.js";

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.category = "espresso";
  this.init = async () => {
    this.menu[this.category] = await MenuApi.getAllMenuByCategory(
      this.category
    );
    render();
    initEventListeners();
  };

  const render = async () => {
    this.menu[this.category] = await MenuApi.getAllMenuByCategory(
      this.category
    );
    $("#menu-list").innerHTML = this.menu[this.category]
      .map(
        (item) => `
               <li data-menu-id="${
                 item.id
               }" class="menu-list-item d-flex items-center py-2">
                  <span class="
                    ${item.isSoldOut ? "sold-out" : ""}
                    w-100 pl-2 menu-name
                  ">${item.name}</span>
                  <button
                    type="button"
                    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
                  >
                    품절
                  </button>
                  <button
                    type="button"
                    class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
                  >
                    삭제
                  </button>
                </li>
            `
      )
      .join("");
    updateMenuCount();
  };

  const addMenu = async () => {
    const $menuName = $("#menu-name");
    if ($menuName.value === "") {
      alert("값을 입력해 주세요.");
      return;
    }

    const duplicatedItem = this.menu[this.category].find(
      (menu) => menu.name === $menuName.value
    );
    if (duplicatedItem) {
      alert("이미 등록된 메뉴입니다. 다시 입력해 주세요.");
      $menuName.value = "";
      return;
    }
    await MenuApi.createMenu(this.category, $menuName.value);
    render();
    $menuName.value = "";
  };

  const updateMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt(
      "메뉴명을 입력해 주세요.",
      $menuName.innerText
    );
    await MenuApi.updateMenu(this.category, menuId, updatedMenuName);
    render();
  };

  const removeMenu = async (e) => {
    if (!confirm("삭제 하시겠습니까?")) return;
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.removeMenu(this.category, menuId);
    render();
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.category, menuId);
    render();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.category].length;
    $(".menu-count").innerText = `총 ${menuCount} 개`;
  };

  const changeCategory = (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      this.category = e.target.dataset.categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  };

  const initEventListeners = () => {
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") return;
      addMenu();
    });

    $("#menu-submit-button").addEventListener("click", addMenu);

    $("#menu-list").addEventListener("click", (e) => {
      if (e.target.classList.contains("menu-edit-button")) return updateMenu(e);
      if (e.target.classList.contains("menu-remove-button"))
        return removeMenu(e);
      if (e.target.classList.contains("menu-sold-out-button"))
        return soldOutMenu(e);
    });

    $("nav").addEventListener("click", changeCategory);
  };
}

const app = new App();
app.init();
