import { NextRequest, NextResponse } from "next/server";
import * as studentsService from "@/server/students";

export async function GET() {
  try {
    const students = await studentsService.getStudents();
    return Response.json(students);
  } catch (error) {
    return new Response("Failed to get students", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const student = await request.json();
    const newStudent = await studentsService.createStudent(student);
    return Response.json(newStudent);
  } catch (error) {
    return new Response("Failed to create student", { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    const updatedStudent = await studentsService.updateStudentStatus(
      id,
      status
    );
    return Response.json(updatedStudent);
  } catch (error) {
    return new Response("Failed to update student", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { message: "Student ID is required" },
        { status: 400 }
      );
    }
    const r = await studentsService.deleteStudent(id);
    if (r.status === 204) return new Response(undefined, { status: r.status });
    return NextResponse.json(r.msg, { status: r.status });
  } catch (error) {
    return new Response("Failed to delete student", { status: 500 });
  }
}
