"use client";
import { Button } from "@/components/ui/button"
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function LoginPage() {


  return (
   
    <div className=" min-h-screen flex justify-center items-center bg-[#eceef7]">
        <Card className="w-full max-w-sm">
            <CardHeader className="flex flex-col items-center">
            <Image
                src="/JaltanLogo.png"  
                alt="Jaltan Logo"
                width={250}    
                height={250}
                className="mt-5"
                />
            <CardTitle className="text-center w-full">Management System</CardTitle>
            </CardHeader>
            <CardContent>
                <form>
                <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder=""
                        required
                    />
                    </div>
                    <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                    </div>
                    <Input id="password" type="password" required />
                    </div>
                </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full" >
                Login
                </Button>
            </CardFooter>
        </Card>    
    </div>
  );
}
