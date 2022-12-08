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
 * - [ ] localStorage의 데이터를 읽어온다.
 * 종류 별 메뉴판 관리
 * - [ ] 에스프레소 메뉴판 관리
 * - [ ] 프라푸치노 메뉴판 관리
 * - [ ] 블렌디드 메뉴판 관리
 * - [ ] 티바나 메뉴판 관리
 * - [ ] 디저트 메뉴판 관리
 * 초기값
 * - [ ] 페이지에 최초로 접근할 때 localStorage에서 에스프레소 메뉴를 읽어온다.
 * - [ ] 불러온 에스프레소 메뉴를 출력한다.
 * 품절
 * - [ ] 품절 버튼을 추가한다.
 * - [ ] 품절 버튼을 누르면 상태값을 localStorage에 저장한다.
 * - [ ] 품절 버튼을 누르면 가장 가까운 부모 li 태그에 sold-out class를 추가한다.
 */

const $ = (selector) => document.querySelector(selector);

const store = {
    set(menu) {
        localStorage.setItem('menu', JSON.stringify(menu));
    },
    get() {
        return localStorage.getItem('menu')
    }
}

function App() {
    this.menu = [];
    this.init = () => {
        if (store.get()?.length > 0) {
            this.menu = JSON.parse(store.get());
        }
        render();
    }

    const render = () => {
        const template = this.menu
            .map((item, index) => `
               <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
                  <span class="w-100 pl-2 menu-name">${item.name}</span>
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
        // 메뉴 목록 마지막에 메뉴를 덧붙인다.
        $('#espresso-menu-list').innerHTML = template;
        updateMenuCount();
    }

    const updateMenuCount = () => {
        // 메뉴 카운트를 업데이트한다.
        const menuCount = $('#espresso-menu-list').querySelectorAll('li').length;
        $('.menu-count').innerText = `총 ${menuCount} 개`;
    }

    const addMenu = () => {
        // 단, 빈 값이면 alert을 출력한다.
        const $espressoMenuName = $('#espresso-menu-name');
        if ($espressoMenuName.value === '') {
            alert('값을 입력해 주세요.');
            return;
        }
        this.menu.push({ name: $espressoMenuName.value });
        store.set(this.menu);
        render();
        // input 초기화
        $espressoMenuName.value = '';
    };

    const updateMenu = (e) => {
        const menuId = e.target.closest('li').dataset.menuId;
        const $menuName = e.target.closest('li').querySelector('.menu-name');
        const updatedMenuName = prompt(
            '메뉴명을 입력해 주세요.',
            $menuName.innerText
        );
        $menuName.innerText = updatedMenuName;
        this.menu[menuId].name = $menuName.innerText;
        store.set(this.menu);
    }

    const removeMenu = (e) => {
        if (!confirm('삭제 하시겠습니까?')) return;
        e.target.closest('li').remove();
        const menuId = e.target.closest('li').dataset.menuId;
        this.menu.splice(Number(menuId), 1);
        store.set(this.menu);
        updateMenuCount();
    }

    $('#espresso-menu-form').addEventListener('submit', (e) => {
        e.preventDefault();
    });

    $('#espresso-menu-name').addEventListener('keypress', (e) => {
        if (e.key !== 'Enter') return;
        addMenu();
    });

    $('#espresso-menu-submit-button').addEventListener('click', addMenu);

    $('#espresso-menu-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('menu-edit-button')) return updateMenu(e);
        if (e.target.classList.contains('menu-remove-button')) return removeMenu(e);
    })
}

const app = new App();
app.init();
