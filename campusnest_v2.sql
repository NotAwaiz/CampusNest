
USE campusnest_v2;

SELECT
    u.name AS student,
    p.title AS property,
    i.message AS inquiry,
    i.status AS inquiry_status
FROM inquiries i
JOIN users u ON u.id = i.user_id
JOIN properties p ON p.id = i.property_id;
