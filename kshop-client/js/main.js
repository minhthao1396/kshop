const END_POINT = 'http://localhost:8080/api/v1/products';

$(function() {
    addListeners();
    loadAllCategories();
    loadAllProducts();
});

function addListeners() {
    $('#products-tbody').on('click', 'tr', function(event) {
        if (event.ctrlKey) {
            $(this).toggleClass('selected');
        } else {
            $(this).addClass('selected').siblings().removeClass('selected');
        }
        const selectedRows = $('.selected').length;
        if (selectedRows == 0) {
            $('#btn-edit').attr('disabled', 'disabled');
            $('#btn-delete').attr('disabled', 'disabled');
        } else if (selectedRows == 1) {
            $('#btn-edit').removeAttr('disabled');
            $('#btn-delete').removeAttr('disabled');
        } else {
            $('#btn-edit').attr('disabled', 'disabled');
            $('#btn-delete').removeAttr('disabled');
        }
    });

    $('#btn-refresh').on('click', function(event) {
        loadAllProducts();
    });

    // Khi người dùng nhấn enter vào ô input page number
    $('#page-number').on('keypress', function (event) {
        // 13 là key code của phím enter
        if (event.which === 13) {
            loadAllProducts();
        }
    });

    // Khi người dùng select page size
    $('#page-size').on('change', function (event) {
        loadAllProducts();
    });

    $('#btn-search').on('click', function(event) {
        loadAllProducts();
    });
}

function loadAllCategories() {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/categories',
        success: function(result) {
            showAllCategories(result.content);
        }
    });
}

function loadAllProducts() {
    debugger
    const searchParams = new URLSearchParams();
    let ram = $('#ram').val();
    if (ram == -1) ram = null;
    let categoryId = $('#categories').val();
    if (categoryId == -1) categoryId = null;

    const params = {
        page: $('#page-number').val(),
        size: $('#page-size').val(),
        search: $('#search').val(),
        ram: ram,
        categoryId: categoryId,
        minYear: $('#min-year').val(),
        maxYear: $('#max-year').val(),
        minCreatedDate: $('#min-created-date').val(),
        maxCreatedDate: $('#max-created-date').val(),
        minSalePrice: $('#min-sale-price').val(),
        maxSalePrice: $('#max-sale-price').val(),
    }
    for (const key in params) {
        if (params[key]) {
            searchParams.set(key, params[key]);
        }
    }

    $.ajax({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/products?' + searchParams,
        beforeSend: function() {
            showLoading();
        },
        success: function(result) {
            showPageInfo(result);
            showAllProducts(result.content);
        },
        complete: function() {
            hideLoading();
        }
    });
}

function showAllCategories(categories) {
    const select = $('#categories');
    for (const category of categories) {
        select.append(`
            <option value="${category.id}">${category.name}</option>
        `);
    }
}

function showPageInfo(result) {
    const start = result.pageable.offset;
    $('#page-info').text(`Showing ${start + 1} to ${start + result.numberOfElements} of ${result.totalElements} rows.`);
    $('#page-number').attr('max', result.totalPages);
}

function showAllProducts(products) {
    const tbody = $('#products-tbody');
    tbody.empty();
    for (const product of products) {
        tbody.append(`
            <tr>
                <th scope="row">${product.id}</th>
                <td>${product.name}</td>
                <td>${product.ram}</td>
                <td>${product.price.toLocaleString('vi-VN')}₫</td>
                <td>${product.salePrice.toLocaleString('vi-VN')}₫</td>
                <td>${product.description}</td>
                <td>
                    <img src="${product.thumbnailUrl}" width="80">
                </td>
                <td>${product.createdDate}</td>
                <td>${product.updatedDate}</td>
                <td>${product.category.name}</td>
            </tr>
        `);
    }
}

function showLoading() {
    $('#loading').show();
}

function hideLoading() {
    $('#loading').hide();
}