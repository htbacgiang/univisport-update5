export default async function handler(req, res) {
  try {
    // Bước 1: Lấy thông tin tọa độ từ ipregistry
    const ipResponse = await fetch(
      `https://api.ipregistry.co/?key=ira_xkvZiz13aqw5LrXR71As4H7kcyIhwA3NFOsB`
    );
    const ipData = await ipResponse.json();

    const latitude = ipData.location.latitude;
    const longitude = ipData.location.longitude;

    // Bước 2: Gửi tọa độ đến Nominatim để lấy thông tin chi tiết
    const geoResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
    );
    const geoData = await geoResponse.json();

    // Trích xuất thông tin từ phản hồi
    const address = geoData.address || {};
    const city = address.city || address.town || address.state; // Thành phố/Tỉnh
    const district = address.county || address.district; // Huyện
    const village = address.village || address.hamlet; // Xã
    const country = address.country;

    res.status(200).json({
      city: city || "Không xác định",
      district: district || "Không xác định",
      village: village || "Không xác định",
      country: country || "Không xác định",
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy vị trí người dùng" });
  }
}