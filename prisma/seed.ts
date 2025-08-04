import { Doctor } from "./db";

const { PrismaClient } = require('./db');
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

function hashed(password: string) {
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
}

async function main() {
  await prisma.practiceHour.deleteMany();
  await prisma.message.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.historicalData.deleteMany();
  await prisma.pharmacy.deleteMany();
  await prisma.mriTest.deleteMany();
  await prisma.urineTest.deleteMany();
  await prisma.bloodTest.deleteMany();
  await prisma.user.deleteMany();
  await prisma.doctor.deleteMany();

  const doctors = await prisma.doctor.createMany({
    data: [
      {
        about: "A cardiologist with extensive experience in heart conditions.",
        name: "Dr. Amanda Wilson",
        specialist: "Cardiology",
        experience: "15 years",
        education: "MD, Harvard Medical School",
        location: "Medic Room 1"
      },
      {
        about: "A pediatrician specializing in child development.",
        name: "Dr. Michael Chen",
        specialist: "Pediatrics",
        experience: "10 years",
        education: "MD, Stanford University",
        location: "Medic Room 2"
      },
      {
        about: "A neurologist with expertise in brain disorders.",
        name: "Dr. Sarah Johnson",
        specialist: "Neurology",
        experience: "12 years",
        education: "MD, Johns Hopkins University",
        location: "Medic Room 3"
      },
      {
        about: "An internist with experience in managing chronic diseases.",
        name: "Dr. Emily White",
        specialist: "Internal Medicine",
        experience: "12 years",
        education: "MD, Yale School of Medicine",
        location: "Medic Room 1"
      },
    ],
  });

  console.log("Doctors added.", doctors);

  const users = await prisma.user.createMany({
    data: [
      {
        email: "d200220069@student.ums.ac.id",
        username: "marko123",
        password: hashed("passwordUser1"),
        name: "Marko Refianto",
        gender: "Male",
        major: "Mechanical Engineering",
        studentId: "D200220069",
        birthPlace: "Jakarta",
        birthDate: new Date("2004-04-14"),
        phoneNumber: "089699521932",
        avatar: ""
      },
      {
        email: "d200220015@student.ums.ac.id",
        username: "adityo123",
        password: hashed("passwordUser2"),
        name: "Muhamamd Adityo Rivalta",
        gender: "Male",
        major: "Mechanical Engineering",
        studentId: "D200220015",
        birthPlace: "Wonogiri",
        birthDate: new Date("2002-02-18"),
        phoneNumber: "085156346402",
        avatar: ""
      }
    ],
  });

  console.log("Users added:", users);

  const doctor1 = await prisma.doctor.findFirst({ where: { name: "Dr. Amanda Wilson" } });
  const user = await prisma.user.findFirst({ where: { name: "Marko Refianto" } });

  const messages = await prisma.message.createMany({
    data: [
      {
        sender: "DOCTOR",
        content: "Hello Marko, how are you feeling today?",
        userId: user.id,
        doctorId: doctor1.id,
        time: new Date("2024-05-01T09:30:00"),
      },
      {
        sender: "USER",
        content: "Hi Dr. Wilson, I'm feeling better than yesterday. The chest pain has decreased.",
        userId: user.id,
        doctorId: doctor1.id,
        time: new Date("2024-05-01T09:32:00"),
      },
      {
        sender: "DOCTOR",
        content: "That's good to hear. Have you been taking the prescribed medications regularly?",
        userId: user.id,
        doctorId: doctor1.id,
        time: new Date("2024-05-01T09:35:00"),
      },
      {
        sender: "USER",
        content: "Yes, I've been taking them as prescribed. But I'm experiencing some dizziness as a side effect.",
        userId: user.id,
        doctorId: doctor1.id,
        time: new Date("2024-05-01T09:38:00"),
      },
      {
        sender: "DOCTOR",
        content: "Dizziness can be a side effect of the medication. When does it typically occur?",
        userId: user.id,
        doctorId: doctor1.id,
        time: new Date("2024-05-01T09:40:00"),
      },
      {
        sender: "USER",
        content: "Usually about an hour after taking the morning dose. It lasts for about 30 minutes.",
        userId: user.id,
        doctorId: doctor1.id,
        time: new Date("2024-05-01T09:42:00"),
      },
      {
        sender: "DOCTOR",
        content: "I see. Try taking it with food to reduce the dizziness. If it persists or worsens, we might need to adjust the dosage.",
        userId: user.id,
        doctorId: doctor1.id,
        time: new Date("2024-05-01T09:43:00"),
      },
    ],
  });

  console.log("Messages added:", messages);

  const historicalData = await prisma.historicalData.createMany({
    data: [
      {
        parameter: "Temperature",
        value: "37.5",
        unit: " °C",
        information: "Normal",
        date: new Date("2024-04-15T10:00:00"),
        userId: user.id,
      },
      {
        parameter: "Blood Pressure",
        value: "120/80",
        unit: " mmHg",
        information: "Normal",
        date: new Date("2024-04-15T10:00:00"),
        userId: user.id,
      },
      {
        parameter: "Heart Rate",
        value: "78",
        unit: "BPM",
        information: "Normal",
        date: new Date("2024-04-15T10:00:00"),
        userId: user.id,
      },
      {
        parameter: "SPO2",
        value: "98",
        unit: "%",
        information: "Normal",
        date: new Date("2024-04-15T10:00:00"),
        userId: user.id,
      },
      {
        parameter: "Temperature",
        value: "38.2",
        unit: "°C",
        information: "Elevated",
        date: new Date("2024-04-14T10:00:00"),
        userId: user.id,
      }
    ]
  });

  console.log("Historical Data created:", historicalData);

  const allDoctors = await prisma.doctor.findMany();

  const practiceHoursData = allDoctors.flatMap((doctor: Doctor) => [
    {
      startTime: "08:00",
      endTime: "12:00",
      dayOfWeek: "Monday",
      doctorId: doctor.id,
    },
    {
      startTime: "13:00",
      endTime: "17:00",
      dayOfWeek: "Wednesday",
      doctorId: doctor.id,
    },
    {
      startTime: "09:00",
      endTime: "14:00",
      dayOfWeek: "Friday",
      doctorId: doctor.id,
    },
  ]);

  const practiceHour = await prisma.practiceHour.createMany({
    data: practiceHoursData,
  });

  console.log("practiceHour added:", practiceHour);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });