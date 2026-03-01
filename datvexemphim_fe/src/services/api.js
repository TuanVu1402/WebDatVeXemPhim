import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export const nguoidungService = {
    // Lấy danh sách người dùng
    layDanhSach: () => api.get('/danhsachnguoidung'),

    // Tạo người dùng mới
    taoMoi: (data) => api.post('/taonguoidung', data),

    // Xem chi tiết người dùng
    xemChiTiet: (id) => api.get(`/nguoidung/${id}`),

    // Cập nhật người dùng
    capNhat: (id, data) => api.put(`/nguoidung/${id}`, data),

    // Xóa người dùng
    xoa: (id) => api.delete(`/nguoidung/${id}`),

    // Đăng nhập
    dangNhap: (data) => api.post('/dangnhap', data),
};

export const bannerApi = {


    //laydanhsachbanner
    getAllBanners: async () => {


        try {
            const response = await api.get('/banners');
            return response.data.data;
        }

        catch (error) {
            console.error('Lỗi khi lấy danh sách banner:', error);
            throw error;
        }
    }

}
/* ================= PHIM ================= */
export const phimApi = {
    getAllPhims: async () => {
        try {
            const response = await api.get('/phims');
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách phim:', error);
            throw error;
        }
    },

    getPhimDangChieu: async () => {
        try {
            const response = await api.get('/phims');
            return response.data.data.filter(
                phim => phim.trang_thai === 'dang_chieu'
            );
        } catch (error) {
            console.error('Lỗi khi lấy phim đang chiếu:', error);
            throw error;
        }
    },

    getPhimSapChieu: async () => {
        try {
            const response = await api.get('/phims');
            return response.data.data.filter(
                phim => phim.trang_thai === 'sap_chieu'
            );
        } catch (error) {
            console.error('Lỗi khi lấy phim sắp chiếu:', error);
            throw error;
        }
    },

    getPhimHot: async () => {
        try {
            const response = await api.get('/phims');
            return response.data.data
                .filter(phim => phim.is_hot)
                .sort((a, b) => b.luot_xem - a.luot_xem);
        } catch (error) {
            console.error('Lỗi khi lấy phim hot:', error);
            throw error;
        }
    },

    getPhimById: async (id) => {
        try {
            const response = await api.get(`/phims/${id}`);
            return response.data.data;
        } catch (error) {
            console.error(`Lỗi khi lấy phim id ${id}:`, error);
            throw error;
        }
    },

    getLichChieuByPhimAndDate: async (phimId, ngay) => {
        try {
            const response = await api.get(`/phims/${phimId}/suat-chieu`, {
                params: { ngay }
            });
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi lấy lịch chiếu theo ngày:', error);
            throw error;
        }
    }
};

/* ================= RẠP CHIẾU ================= */
export const rapApi = {
    // 1. Lấy tất cả rạp
    getAllRaps: async () => {
        try {
            const response = await api.get('/raps');
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách rạp:', error);
            throw error;
        }
    },

    // 2. Lấy chi tiết rạp
    getRapById: async (id) => {
        try {
            const response = await api.get(`/raps/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết rạp:', error);
            throw error;
        }
    },

    // 3. Lấy phim đang chiếu tại rạp
    getPhimsByRap: async (rapId) => {
        try {
            const response = await api.get(`/raps/${rapId}/phims`);
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi lấy phim theo rạp:', error);
            throw error;
        }
    },

    // 4. Lấy lịch chiếu theo rạp và ngày
    getLichChieuByRapAndDate: async (rapId, ngay) => {
        try {
            const response = await api.get(`/raps/${rapId}/lich-chieu`, {
                params: { ngay }
            });
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi lấy lịch chiếu:', error);
            throw error;
        }
    },

    // 5. Tìm kiếm rạp
    searchRaps: async (keyword) => {
        try {
            const response = await api.get('/raps/search', {
                params: { keyword }
            });
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi tìm kiếm rạp:', error);
            throw error;
        }
    }
};

/* ================= SUẤT CHIẾU ================= */
export const suatChieuApi = {
    // 1. Lấy tất cả suất chiếu
    getAllSuatChieu: async (page = 1, perPage = 20) => {
        try {
            const response = await api.get('/suat-chieu', {
                params: { page, per_page: perPage }
            });
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách suất chiếu:', error);
            throw error;
        }
    },

    // 2. Lấy chi tiết suất chiếu
    getSuatChieuById: async (id) => {
        try {
            const response = await api.get(`/suat-chieu/${id}`);
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết suất chiếu:', error);
            throw error;
        }
    },

    // 3. Lấy suất chiếu theo phim
    getByPhim: async (phimId) => {
        try {
            const response = await api.get(`/phims/${phimId}/suat-chieu`);
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi lấy suất chiếu theo phim:', error);
            throw error;
        }
    },

    // 4. Lấy suất chiếu theo rạp
    getByRap: async (rapId) => {
        try {
            const response = await api.get(`/raps/${rapId}/suat-chieu`);
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi lấy suất chiếu theo rạp:', error);
            throw error;
        }
    },

    // 5. Tìm kiếm suất chiếu
    timKiem: async (filters) => {
        try {
            const response = await api.get('/suat-chieu/tim-kiem', {
                params: filters
            });
            return response.data.data;
        } catch (error) {
            console.error('Lỗi khi tìm kiếm suất chiếu:', error);
            throw error;
        }
    }
};

export default api;