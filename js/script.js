document.addEventListener('DOMContentLoaded', function() {
    const letterListSublist = document.getElementById('letter-sublist');
    const searchInput = document.getElementById('search-input');
    const contentMain = document.getElementById('content');
    const sortByDefaultLink = document.querySelector('#sort-sublist a[data-sort="default"]');
    const scrollToTopLink = document.getElementById('scroll-to-top');
    const toggleLanguageLink = document.getElementById('toggle-language');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const bodyElement = document.body; // Lấy thẻ body để dịch chuyển toàn bộ layout (optional)
    const sortByTitleLink = document.querySelector('#sort-sublist a[data-sort="title"]'); // Giữ lại nếu còn sắp xếp theo tiêu đề
    const sortByDefaultOrderLink = document.querySelector('#sort-sublist a[data-sort="default-order"]'); // Link mới cho "Mặc định (Từ trên xuống)"
    const sortByReverseOrderLink = document.querySelector('#sort-sublist a[data-sort="reverse-order"]'); // Link mới cho "Đảo ngược (Từ dưới lên)"
    let currentLanguage = 'vi'; // Ngôn ngữ mặc định là tiếng Việt
    let lettersData = []; // Biến lưu trữ dữ liệu thư sau khi fetch
    
    hamburgerBtn.addEventListener('click', function() {
        sidebarMenu.classList.toggle('sidebar-open'); // Toggle class 'sidebar-open' cho menu
        bodyElement.classList.toggle('sidebar-open'); // Toggle class 'sidebar-open' cho body (optional)
    });

    // Fetch dữ liệu từ data.json và khởi tạo trang
    fetch('data/data.json')
        .then(response => response.json())
        .then(data => {
            lettersData = data; // Lưu dữ liệu vào biến lettersData
            renderLetters(lettersData); // Gọi hàm render để hiển thị thư
            updateLetterSublist(); // Cập nhật danh sách thư trong menu
        })
        .catch(error => console.error('Lỗi khi tải dữ liệu thư:', error));

    function renderLetters(letters) {
        contentMain.innerHTML = ''; // Xóa nội dung cũ trước khi render
        letters.forEach(letter => {
            const article = document.createElement('article');
            article.classList.add('letter');
            article.id = letter.id; // Sử dụng ID từ data.json
            article.innerHTML = `
                <h2>${letter.title}</h2>
                ${letter.date ? `<p class="date">${letter.date}</p>` : ''}
                ${letter.note ? `<p class ="note">${letter.note}</p>` : ''}
                <div class="letter-content">
                    <div lang="vi">
                        <h3>Tiếng Việt:</h3>
                        ${letter.vietnameseContent}
                    </div>
                    <div lang="zh" class="chinese-text">
                        <h3>中文:</h3>
                        ${letter.chineseContent}
                    </div>
                </div>
            `;
            contentMain.appendChild(article);
        });
    }


    function updateLetterSublist() {
        letterListSublist.innerHTML = ''; // Xóa danh sách cũ
        const letterArticles = document.querySelectorAll('article.letter'); // Lấy danh sách các article *sau khi đã render*
        letterArticles.forEach(function(article) {
            const letterTitle = article.querySelector('h2').textContent;
            const letterId = article.id;
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#' + letterId;
            link.textContent = letterTitle;
            listItem.appendChild(link);
            letterListSublist.appendChild(listItem);
        });
    }

    // 2. Chức năng Sắp xếp theo Tiêu đề
    // 2a. Chức năng Sắp xếp Mặc định (Từ trên xuống)
    sortByDefaultOrderLink.addEventListener('click', function(event) {
        event.preventDefault();
        sortByDefaultOrder();
    });

    function sortByDefaultOrder() {
        renderLetters(lettersData); // Render lại theo thứ tự ban đầu trong data.json
        updateLetterSublist();
    }

    // 2b. Chức năng Sắp xếp Đảo ngược (Từ dưới lên)
    sortByReverseOrderLink.addEventListener('click', function(event) {
        event.preventDefault();
        sortByReverseOrder();
    });

    function sortByReverseOrder() {
        const reversedLetters = [...lettersData].reverse(); // Đảo ngược mảng lettersData
        renderLetters(reversedLetters); // Render lại với dữ liệu đã đảo ngược
        updateLetterSublist();
    }

    // 2c. Chức năng Sắp xếp theo Tiêu đề (giữ lại nếu muốn)
    if (sortByTitleLink) { // Kiểm tra xem link này có tồn tại không (nếu bạn bỏ tùy chọn này trong HTML)
        sortByTitleLink.addEventListener('click', function(event) {
            event.preventDefault();
            sortLettersByTitle(); // Gọi lại hàm sắp xếp theo tiêu đề cũ (nếu bạn muốn giữ lại)
        });
    }

    function sortLettersByTitle() { // Giữ lại hàm sắp xếp theo tiêu đề cũ (nếu bạn muốn giữ lại)
        // ... (hàm sortLettersByTitle cũ của bạn) ...
    }




    // 3. Chức năng Tìm kiếm
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filteredLetters = lettersData.filter(letter => { // Lọc dữ liệu trong lettersData
            const letterText = (letter.vietnameseContent + letter.chineseContent).toLowerCase(); // Tìm kiếm trong cả hai ngôn ngữ
            return letterText.includes(searchTerm) || letter.title.toLowerCase().includes(searchTerm); // Tìm cả trong tiêu đề
        });
        renderLetters(filteredLetters); // Render lại chỉ các thư tìm thấy
        updateLetterSublist(); // Cập nhật lại danh sách thư (chỉ hiển thị thư tìm thấy trong menu) - *tùy chọn, có thể bỏ qua nếu không muốn cập nhật menu khi tìm kiếm*
    });

    // 4. Tính năng khác: Về đầu trang
    scrollToTopLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn mượt lên đầu trang
    });

    // 5. Tính năng khác: Đổi ngôn ngữ hiển thị
    toggleLanguageLink.addEventListener('click', function(event) {
        event.preventDefault();
        toggleLanguage();
    });

    function toggleLanguage() {
        const vietnameseElements = document.querySelectorAll('[lang="vi"]');
        const chineseElements = document.querySelectorAll('[lang="zh"]');

        if (currentLanguage === 'vi') {
            vietnameseElements.forEach(el => el.style.display = 'none');
            chineseElements.forEach(el => el.style.display = '');
            currentLanguage = 'zh';
        } else {
            vietnameseElements.forEach(el => el.style.display = '');
            chineseElements.forEach(el => el.style.display = 'none');
            currentLanguage = 'vi';
        }
    }


});