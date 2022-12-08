/**
 * step1 요구사항 구현을 위한 전략
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
 * - [ ] 삭제 버튼을 누르면 삭제 확인 confirm 창을 출력한다.
 * - [ ] confirm 창은 브라우저 confirm 인터페이스를 이용한다.
 * - [ ] 변경된 총 메뉴 갯수를 상단에 출력한다.
 *
 */

const $ = (selector) => document.querySelector(selector);

function App() {
    // Form 태그 자동으로 전송되는 것을 막음
    $('#espresso-menu-form').addEventListener('submit', (e) => {
        e.preventDefault();
    });

    // 메뉴 이름 입력 받기
    $('#espresso-menu-name').addEventListener('keypress', (e) => {
        // 엔터키를 누르면 메뉴를 추가한다.
        if (e.key !== 'Enter') return;
        addEspressoMenuName();
    });

    const addEspressoMenuName = () => {
        // 단, 빈 값이면 alert을 출력한다.
        const $espressoMenuName = $('#espresso-menu-name');
        if ($espressoMenuName.value === '') {
            alert('값을 입력해 주세요.');
            return;
        }
        const menuItemTemplate = (espressoMenuName) => `
           <li class="menu-list-item d-flex items-center py-2">
              <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
       `;
        // 메뉴 목록 마지막에 메뉴를 덧붙인다.
        $espressoMenuList.insertAdjacentHTML(
            'beforeend',
            menuItemTemplate($espressoMenuName.value)
        );
        // 메뉴 카운트를 업데이트한다.
        const menuCount = $espressoMenuList.querySelectorAll('li').length;
        $('.menu-count').innerText = `총 ${menuCount} 개`;
        // input 초기화
        $espressoMenuName.value = '';
    };

    $('#espresso-menu-submit-button').addEventListener('click', () => {
        addEspressoMenuName();
    });

    // 메뉴 수정
    const $espressoMenuList = $('#espresso-menu-list');
    $espressoMenuList.addEventListener('click', (e) => {
        if (!e.target.classList.contains('menu-edit-button')) return;
        const $menuName = e.target.closest('li').querySelector('.menu-name');
        $menuName.innerText = prompt(
            '메뉴명을 입력해 주세요.',
            $menuName.innerText
        );
    })

}

App();
