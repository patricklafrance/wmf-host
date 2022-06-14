import { Card, Content, Div, H2, Heading, Illustration, Image, Paragraph } from "@sharegate/orbit-ui";

import { Planet } from "./assets";
import React from "react";

export default function HomePage() {
    return (
        <main>
            <H2>Home</H2>
            <Div>
                <Card>
                    <Illustration backgroundColor="alias-accent-light">
                        <Image src={Planet} alt="Planet over another one" width="100px" />
                    </Illustration>
                    <Heading>NASA Headquarters</Heading>
                    <Content>
                        <Paragraph>
                            NASA Headquarters, officially known as Mary W. Jackson NASA Headquarters or NASA HQ and
                            formerly named Two Independence Square, is a low-rise office building in the
                            two-building Independence Square complex at 300 E Street SW in Washington, D.C.
                        </Paragraph>
                    </Content>
                </Card>
            </Div>
        </main>
    );
  };