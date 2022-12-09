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
 */

import { $ } from './utils/dom.js';
import store from "./store";

function App() {
    this.menu = {
        espresso: [],
        frappuccino: [],
        blended: [],
        teavana: [],
        desert: []
    };
    this.category = 'espresso';
    this.init = () => {
        if (store.get()) {
            this.menu = JSON.parse(store.get());
        }
        render();
        initEventListeners();
    }

    const render = () => {
        $('#menu-list').innerHTML = this.menu[this.category]
            .map((item, index) => `
               <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
                  <span class="
                    ${item.soldOut ? 'sold-out' : ''}
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
            `)
            .join('');
        updateMenuCount();
    }

    const updateMenuCount = () => {
        const menuCount = this.menu[this.category].length;
        $('.menu-count').innerText = `총 ${menuCount} 개`;
    }

    const addMenu = () => {
        const $menuName = $('#menu-name');
        if ($menuName.value === '') {
            alert('값을 입력해 주세요.');
            return;
        }
        this.menu[this.category].push({ name: $menuName.value });
        store.set(this.menu);
        render();
        $menuName.value = '';
    };

    const updateMenu = (e) => {
        const menuId = e.target.closest('li').dataset.menuId;
        this.menu[this.category][menuId].name = prompt(
            '메뉴명을 입력해 주세요.',
            this.menu[this.category][menuId].name
        );
        store.set(this.menu);
        render();
    }

    const removeMenu = (e) => {
        if (!confirm('삭제 하시겠습니까?')) return;
        const menuId = e.target.closest('li').dataset.menuId;
        this.menu[this.category].splice(Number(menuId), 1);
        store.set(this.menu);
        render();
    }

    const soldOutMenu = (e) => {
        const menuId = e.target.closest('li').dataset.menuId;
        this.menu[this.category][menuId].soldOut = !this.menu[this.category][menuId].soldOut;
        store.set(this.menu);
        render();
    }

    const initEventListeners = () => {
        $('#menu-form').addEventListener('submit', (e) => {
            e.preventDefault();
        });

        $('#menu-name').addEventListener('keypress', (e) => {
            if (e.key !== 'Enter') return;
            addMenu();
        });

        $('#menu-submit-button').addEventListener('click', addMenu);

        $('#menu-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('menu-edit-button')) return updateMenu(e);
            if (e.target.classList.contains('menu-remove-button')) return removeMenu(e);
            if (e.target.classList.contains('menu-sold-out-button')) return soldOutMenu(e);
        })

        $('nav').addEventListener('click', (e) => {
            const isCategoryButton = e.target.classList.contains('cafe-category-name');
            if (isCategoryButton) {
                this.category = e.target.dataset.categoryName;
                $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;
                render();
            }
        })
    }
}

const app = new App();
app.init();
