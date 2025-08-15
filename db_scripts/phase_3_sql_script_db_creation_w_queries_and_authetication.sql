-- SQL Script 
/*  ********************************  
    Project Phase II
    Project: "Airport System Application Project" 
    Group: Team 11
    @ Author: Kirill Grichanichenko and Artem Grichanichenko
    This SQL Script was tested on MySQL Workbench using MySQL
    ********************************  
*/

-- ************************************ --
--  Create airport_system_db database 	--
-- ************************************ --
CREATE DATABASE IF NOT EXISTS airport_system_db;
USE airport_system_db;

-- ************************************ --
--               Part A                 --
-- There are 9 tables for our database --
-- ************************************ --

-- 1. Create Airport_Location Table
-- Purpose: Holds Airport location Data.
CREATE TABLE IF NOT EXISTS airport_location
(
    	location_zip BIGINT,
    	city VARCHAR(255) NOT NULL,
    	state VARCHAR(255) NOT NULL,
    	PRIMARY KEY (location_zip)
);

-- 2. Create Airport Table
-- Purpose: Holds Airport Data.
CREATE TABLE IF NOT EXISTS airport
(
    	airport_id BIGINT AUTO_INCREMENT,
    	airport_name VARCHAR(255) NOT NULL,
    	code VARCHAR(10) NOT NULL UNIQUE,
    	location_zip BIGINT NOT NULL,
    	PRIMARY KEY (airport_id),
    	CONSTRAINT fk_airport_location
    		FOREIGN KEY (location_zip) REFERENCES airport_location(location_zip)
    		ON DELETE RESTRICT -- Prevent deletion
    		ON UPDATE CASCADE -- Update location of airports
);


-- 3. Create Customer Table
-- Purpose: Holds Customer Data.
CREATE TABLE IF NOT EXISTS customer
(
	user_id BIGINT AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL DEFAULT 'N/A',
    passport_number VARCHAR(20) UNIQUE,
    PRIMARY KEY (user_id),
    CONSTRAINT chk_validation_email CHECK (email LIKE '%@%.%'),
    CONSTRAINT chk_name_length CHECK (LENGTH(first_name) >= 2 AND LENGTH(last_name) >= 2)
);

-- 3. Create Authetication Table
-- Purpose: Holds Customer login information.
CREATE TABLE IF NOT EXISTS authentication
(
	authentication_id BIGINT AUTO_INCREMENT,
	user_id BIGINT NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (authentication_id),
	CONSTRAINT fk_authetication
		FOREIGN KEY (user_id) REFERENCES customer(user_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
);

-- 4. Create Class Table
-- Purpose: Holds Seat Class Data.
CREATE TABLE IF NOT EXISTS class
(
    class_type VARCHAR(255) NOT NULL UNIQUE,
    seat_price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (class_type)
);

-- 7. Create Seat Table
-- Purpose: Holds Seat Data.
CREATE TABLE IF NOT EXISTS seat
(
		seat_number VARCHAR(20) NOT NULL,
    	class_type VARCHAR(255) NOT NULL,
    	PRIMARY KEY (seat_number),
    	CONSTRAINT fk_seat_class_type
    		FOREIGN KEY (class_type) REFERENCES class(class_type)
    		ON DELETE RESTRICT
    		ON UPDATE CASCADE
);

-- 6. Create Flight Table
-- Purpose: Holds Flight Data.
CREATE TABLE IF NOT EXISTS flight
(
	flight_number VARCHAR(255),
    airline VARCHAR(255) NOT NULL,
    departure_airport_id BIGINT NOT NULL,
    arrival_airport_id BIGINT NOT NULL,
    boarding_time DATETIME NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    gate_number varchar(255),
    PRIMARY KEY(flight_number),
    UNIQUE (departure_airport_id, gate_number), -- No flights can share the same gate at the same airport. Future work can include propery time management with gate sharing with similar airports
    CONSTRAINT fk_flight_departure_airport
		FOREIGN KEY (departure_airport_id) REFERENCES airport(airport_id)
    	ON DELETE RESTRICT
    	ON UPDATE CASCADE,
    CONSTRAINT fk_flight_arrival_airport
    	FOREIGN KEY (arrival_airport_id) REFERENCES airport(airport_id)
    	ON DELETE RESTRICT
    	ON UPDATE CASCADE,
    CONSTRAINT validate_flight_time 
    	CHECK (arrival_time > departure_time AND departure_time > boarding_time)
);

-- 8. Create Ticket Table
-- Purpose: Holds Ticket Data.
CREATE TABLE IF NOT EXISTS ticket
(
    ticket_id BIGINT AUTO_INCREMENT,
    flight_number VARCHAR(255) NOT NULL,
    user_id BIGINT NOT NULL,
    seat_number VARCHAR(20) NOT NULL,
    PRIMARY KEY (ticket_id),
    -- CONSTRAINT unique_cust_per_flight UNIQUE (user_id, flight_number), -- This constraint makes it so that a user can only book one flight. However, this is not accurate because a customer can book multiople seats in a flight. 
    CONSTRAINT unique_seat_per_flight UNIQUE (flight_number, seat_number), -- Constraint to make sure one seat number per flight 
    CONSTRAINT fk_ticket_flight
        FOREIGN KEY (flight_number) REFERENCES flight(flight_number)
        ON DELETE CASCADE -- If flight is deleted ticket is deleted
    	ON UPDATE CASCADE, -- If flight is updated ticket is updated
    CONSTRAINT fk_ticket_customer
        FOREIGN KEY (user_id) REFERENCES customer(user_id)
        ON DELETE CASCADE -- If customer is deleted ticket is deleted
    	ON UPDATE CASCADE, -- If customer is updated ticket is updated
    CONSTRAINT fk_ticket_seat
        FOREIGN KEY (seat_number) REFERENCES seat(seat_number)
        ON DELETE RESTRICT  -- Prevent seat is deletion
    	ON UPDATE CASCADE  -- If seat is updated ticket is updated
);

-- 9. Create Booking Table
-- Purpose: Holds Booking (ticket price) Data.
CREATE TABLE IF NOT EXISTS booking
(
    booking_id BIGINT AUTO_INCREMENT,
    ticket_id BIGINT UNIQUE NOT NULL,
    booking_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    flight_price DECIMAL(10, 2) NOT NULL DEFAULT 150.00,
    seat_price DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (booking_id),
    CONSTRAINT fk_booking_ticket
        FOREIGN KEY (ticket_id) REFERENCES ticket(ticket_id)
        ON DELETE CASCADE -- If ticket is deleted, booking is deleted
        ON UPDATE CASCADE -- If ticket updated booking is updated
);

-- booking trigger to dynamically calculate the ticket pricing given ticket_id
DELIMITER //
CREATE TRIGGER calculate_booking_cost
BEFORE INSERT ON booking
FOR EACH ROW
BEGIN
	SET NEW.seat_price = 
    (
		SELECT seat_price
        FROM ticket
        JOIN seat USING (seat_number)
        JOIN class USING (class_type)
        WHERE ticket_id = NEW.ticket_id
    );
	SET NEW.tax = (NEW.flight_price + NEW.seat_price) * 0.15; -- tax is 15% | default flight_price is 150.0 
    SET NEW.total_price = NEW.flight_price + NEW.tax + NEW.seat_price;
END //
DELIMITER ;

-- ************************************ --
--               Part B                 --
-- The sample of the data of each table --
-- ************************************ --

-- 1. Sample Data for Airport_location
-- Purpose: Store data about airport location
INSERT INTO airport_location (location_zip, city, state) VALUES
(10001, 'New York', 'NY'),
(90045, 'Los Angeles', 'CA'),
(60666, 'Chicago', 'IL'),
(77032, 'Houston', 'TX'),
(30320, 'Atlanta', 'GA'),
(80249, 'Denver', 'CO'),
(75261, 'Dallas', 'TX'),
(94128, 'San Francisco', 'CA'),
(98158, 'Seattle', 'WA'),
(33142, 'Miami', 'FL');


-- 2. Sample Data for Airport
-- Purpose: Store data about airport
INSERT INTO airport (airport_name, code, location_zip) VALUES
('John F. Kennedy International Airport', 'JFK', 10001),
('Los Angeles International Airport', 'LAX', 90045),
('O\'Hare International Airport', 'ORD', 60666),
('George Bush Intercontinental Airport', 'IAH', 77032),
('Hartsfield-Jackson Atlanta International Airport', 'ATL', 30320),
('Denver International Airport', 'DEN', 80249),
('Dallas/Fort Worth International Airport', 'DFW', 75261),
('San Francisco International Airport', 'SFO', 94128),
('Seattle-Tacoma International Airport', 'SEA', 98158),
('Miami International Airport', 'MIA', 33142);

-- 3. Sample Data for Customer
-- Purpose: Store data about customer
INSERT INTO customer (first_name, last_name, email, phone, passport_number) VALUES
('Alice', 'Smith', 'alice.smith@example.com', '111-222-3333', 'PS123456'),
('Bob', 'Johnson', 'bob.j@example.com', '444-555-6666', 'PS789012'),
('Charlie', 'Brown', 'cbrownie@example.com','777-888-9999', 'PS345678'),
('Diana', 'Prince', 'diana.p@example.com', '222-333-4444', 'PS901234'),
('Eve', 'Adams', 'eve.a@example.com', '555-666-7777', 'PS567890'),
('Frank', 'White', 'frank.w@example.com', '888-999-0000', 'PS654321'),
('Grace', 'Taylor', 'grace.t@example.com', '123-456-7890', 'PS098765'),
('Henry', 'Miller','henry.m@example.com', '321-654-9870', 'PS246813'),
('Ivy', 'Davis', 'ivy.d@example.com', '987-654-3210', 'PS135792'),
('Jack', 'Garcia', 'jack.g@example.com', '987-654-3212', 'PS864209'),
('Jerry', 'Jones', 'JerrJ.g@example.com', '967-694-3112', 'PS864569');

-- 3. Sample Data for Customer
-- Purpose: Store data about customer
INSERT INTO authentication (user_id, username, password) VALUES
(1, 'asmith', 'pass123'),
(2, 'bjohnson', 'securepwd'),
(3, 'cbrown', 'mysecret'),
(4, 'dprince', 'wonderw'),
(5, 'eadams', 'evypass'),
(6, 'fwhite', 'frankpwd'),
(7, 'gtaylor', 'gracet'),
(8, 'hmiller', 'henry_m'),
(9, 'idavis', 'ivy_d'),
(10, 'jgarcia', 'jackg'),
(11, 'jjones', 'jj123');

-- 4. Sample Data for Class
-- Purpose: Store data about seat class
INSERT INTO class (class_type, seat_price) VALUES
('First Class', 700.00),
('Business', 350.00),
('Economy', 100.00);

-- 5. Sample Data for Seat
-- Purpose: Store data to map seat_number to specific class
INSERT INTO seat (seat_number, class_type) VALUES
('A1', 'First Class'),
('A2', 'First Class'),
('A3', 'First Class'),
('B1', 'Business'),
('B2', 'Business'),
('B3', 'Business'),
('C1', 'Economy'),
('C2', 'Economy'),
('C3', 'Economy'),
('C4', 'Economy');

-- 5. Sample Data for Flight
-- Purpose: Store data flight
INSERT INTO flight (flight_number, airline, departure_airport_id, arrival_airport_id, boarding_time, departure_time, arrival_time, gate_number) VALUES
('AA101', 'American Airlines', 1, 2, '2025-08-01 07:00:00', '2025-08-01 07:30:00', '2025-08-01 10:30:00', 'A12'),
('DL200', 'Delta Airlines', 2, 3, '2025-08-01 09:15:00', '2025-08-01 09:45:00', '2025-08-01 12:45:00', 'B05'),
('UA303', 'United Airlines', 3, 1, '2025-08-02 14:00:00', '2025-08-02 14:30:00', '2025-08-02 17:30:00', 'C20'),
('SW404', 'Southwest Airlines', 4, 5, '2025-08-02 18:30:00', '2025-08-02 19:00:00', '2025-08-02 21:00:00', 'D01'),
('AA505', 'American Airlines', 5, 2, '2025-08-03 10:00:00', '2025-08-03 10:30:00', '2025-08-03 13:30:00', 'E15'),
('DL606', 'Delta Airlines', 6, 7, '2025-08-03 12:00:00', '2025-08-03 12:30:00', '2025-08-03 15:00:00', 'F03'),
('UA707', 'United Airlines', 7, 8, '2025-08-04 06:00:00', '2025-08-04 06:30:00', '2025-08-04 09:00:00', 'G07'),
('SW808', 'Southwest Airlines', 8, 9, '2025-08-04 20:00:00', '2025-08-04 20:30:00', '2025-08-04 22:30:00', 'H10'),
('AA909', 'American Airlines', 9, 10, '2025-08-05 08:45:00', '2025-08-05 09:15:00', '2025-08-05 11:45:00', 'I02'),
('DL110', 'Delta Airlines', 10, 1, '2025-08-05 15:30:00', '2025-08-05 16:00:00', '2025-08-05 20:00:00', 'J11');

-- 7. Sample Data for ticket
-- Purpose: Store ticket data
INSERT INTO ticket (flight_number, user_id, seat_number) VALUES
('AA101', 1, 'A1'), 
('DL200', 2, 'A2'), 
('UA303', 3, 'A3'), 
('SW404', 4, 'B1'),
('AA505', 5, 'B2'),
('DL606', 6, 'B3'), 
('UA707', 7, 'C1'), 
('SW808', 8, 'C2'),
('AA909', 9, 'C3'),
('AA101', 10, 'C4');

-- 8. Sample Data for booking
-- Purpose: Store booking data
-- booking_date and flight_price have default values 
-- seat_cost, tax, and total_price are dynamically calculated using the calculate_booking_cost trigger before insertion using the ticket_id value to retreive the seat pricing. 
INSERT INTO booking (ticket_id) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10);

-- ************************************ --
--               Part C                 --
--        Designing SQL Queries         --
-- ************************************ –

-- *************************** 
-- Query 1
-- Purpose: Get all ticket information including the customer who owns the ticket, the ticket type with seat information, and the booking details of that ticket.
-- Expected: Each row shows a ticket id, name of customer and email of customer, flight number seat number, seat class, booking date, and booking price information (flight price, seat price, tax, total price)
SELECT 
    ticket.ticket_id,
    customer.first_name,
    customer.last_name,
    customer.email,
    ticket.flight_number,
    seat.seat_number,
    class.class_type,
    booking.booking_date,
    booking.flight_price,
    booking.seat_price,
    booking.tax,
    booking.total_price
FROM ticket
JOIN customer 
    ON ticket.user_id = customer.user_id
JOIN seat
    ON ticket.seat_number = seat.seat_number
JOIN class
    ON seat.class_type = class.class_type
JOIN booking
    ON ticket.ticket_id = booking.ticket_id
ORDER BY ticket.ticket_id;

-- *************************** 
-- Query 2
-- Purpose: List flights where one or more tickets have been sold.
-- Expected: Flight numbers with a count of tickets.
SELECT flight_number, COUNT(*) AS ticket_count
FROM ticket
GROUP BY flight_number
HAVING COUNT(*) >= 1;

-- *************************** 
-- Query 3
-- Purpose: Show all passengers on a specific flight (flight requirement can change).
-- Expected: List of customer names and id's who are passengers on a flight.
SELECT customer.user_id, customer.first_name, customer.last_name
FROM customer
JOIN ticket 
    ON customer.user_id = ticket.user_id
WHERE ticket.flight_number = 'AA101';

-- *************************** 
-- Query 3 - extension
-- Purpose: Show all passengers on a specific flight and class seat (class and flight requirements can change).
-- Expected: List of customer names who booked First Class.
SELECT customer.user_id, customer.first_name, customer.last_name
FROM customer
JOIN ticket
    ON customer.user_id = ticket.user_id
JOIN seat 
    ON ticket.seat_number = seat.seat_number
JOIN class 
    ON seat.class_type = class.class_type
WHERE ticket.flight_number = 'AA101'
  AND class.class_type = 'First Class';

-- *************************** 
-- Query 4
-- Purpose: List all flights and tickets, even if a flight has no ticket.
-- Expected: Full outer result with flight number and ticket id with null values if flight does not have any tickets
SELECT flight.flight_number, ticket.ticket_id
FROM flight
LEFT JOIN ticket ON flight.flight_number = ticket.flight_number
UNION
SELECT flight.flight_number, ticket.ticket_id
FROM flight
RIGHT JOIN ticket ON flight.flight_number = ticket.flight_number;

-- *************************** 
-- Query 5
-- Purpose: Show all customers who have tickets and don't have tickets
-- Expected: List of customer names and ID with true or false for has ticket.
SELECT customer.user_id, customer.first_name, customer.last_name, TRUE AS 'Has Ticket'
FROM customer
WHERE customer.user_id IN (SELECT ticket.user_id FROM ticket)
UNION
SELECT customer.user_id, customer.first_name, customer.last_name, FALSE AS 'Has Ticket'
FROM customer
WHERE customer.user_id NOT IN (SELECT ticket.user_id FROM ticket);

-- *************************** 
-- Query 6
-- Purpose: List available seat numbers for flight 'AA101' (flight requirement can change)
-- Expected: Seat numbers marked as available for the specific flight.
SELECT seat.seat_number
FROM seat
WHERE seat.seat_number NOT IN (
    SELECT ticket.seat_number 
    FROM ticket
    WHERE ticket.flight_number = 'AA101'
)
ORDER BY seat.seat_number;

-- *************************** 
-- Query 7
-- Purpose: Show all bookings made by 'Alice Smith' (name requirement can change)
-- Expected: Booking ID, total price, and booking date.
SELECT 
customer.first_name,
customer.last_name,
booking.ticket_id,
booking.booking_id,
booking.total_price,
booking.booking_date
FROM booking
JOIN ticket ON booking.ticket_id = ticket.ticket_id
JOIN customer ON ticket.user_id = customer.user_id
WHERE customer.first_name = 'Alice' AND customer.last_name = 'Smith';

-- *************************** 
-- Query 8
-- Purpose: Show all flights at an airport, including its name and code.
-- Expected: List of flight numbers, airline names, and departure airport details.
SELECT 
    flight.flight_number,
    flight.airline,
    departure_airport.code AS departure_airport_code,
    arrival_airport.code AS arrival_airport_code,
    flight.boarding_time,
    flight.departure_time,
    flight.arrival_time,
    flight.gate_number
FROM flight
JOIN airport departure_airport 
    ON flight.departure_airport_id = departure_airport.airport_id
JOIN airport arrival_airport 
    ON flight.arrival_airport_id = arrival_airport.airport_id
WHERE departure_airport.airport_id = 1;

-- *************************** 
-- Query 9
-- Purpose: Show all available seats for a specific flight and class type.
-- Expected: List of seat numbers that are still available for the given flight and class type.
SELECT 
    seat.seat_number,
    class.class_type,
    'AA101' AS flight_number
FROM seat
JOIN class
    ON seat.class_type = class.class_type
WHERE class.class_type = 'Economy'
  AND seat.seat_number NOT IN (
        SELECT seat_number
        FROM ticket
        WHERE flight_number = 'AA101'
    )
ORDER BY seat.seat_number;

-- *************************** 
-- Query 10
-- Purpose: Get flight, airline, gate number, and boarding time with proper frontend formatting
-- Expected: List of flights with their boarding details.
SELECT 
    flight.flight_number AS flight,
    flight.airline AS airline,
    airport.airport_name AS airport,
    flight.gate_number AS gate,
    flight.boarding_time AS boarding
FROM flight
JOIN airport 
    ON flight.departure_airport_id = airport.airport_id;

-- End of Script (July 30, 2025)
