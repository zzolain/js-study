# VanillaJS로 구현하는 상태 관리 가능 카페 메뉴 앱
## 참고 강의
- [블랙커피 Vanilla JS Lv1. 문벅스 카페 메뉴 앱 만들기](https://www.udemy.com/course/vanilla-js-lv1/)
## 요구사항
- [ ] 에스프레소 메뉴에 새로운 메뉴를 확인 버튼 또는 엔터키 입력으로 추가한다.
  - [ ] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
  - [ ] 사용자 입력값이 빈 값이라면 추가되지 않는다.
- [ ] 메뉴의 수정 버튼을 눌러 메뉴 이름 수정할 수 있다.
  - [ ] 메뉴 수정시 브라우저에서 제공하는 prompt 인터페이스를 활용한다.
- [ ] 메뉴 삭제 버튼을 이용하여 메뉴 삭제할 수 있다.
    - [ ] 메뉴 삭제시 브라우저에서 제공하는 confirm 인터페이스를 활용한다.
- [ ] 총 메뉴 갯수를 count하여 상단에 보여준다.
    - [ ] 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
```javascript
<li class="menu-list-item d-flex items-center py-2">
  <span class="w-100 pl-2 menu-name">${name}</span>
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
```
