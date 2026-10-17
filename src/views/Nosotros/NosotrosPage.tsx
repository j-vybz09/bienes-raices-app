import ScrollStack, { ScrollStackItem } from '../../components/ScrollStack'

export default function NosotrosPage() {
  return (
    <>
      <section className="text-center pt-10">
        <h2 className="text-5xl">Sobre Nosotros</h2>

        <div className="max-w-7xl mx-auto py-15">
          <div className="grid grid-cols-2 gap-5">
            <div className=" h-120 w-auto">
              <ScrollStack>
                <ScrollStackItem>
                  <h2>Card 1</h2>
                  <p>This is the first card in the stack</p>
                </ScrollStackItem>
                <ScrollStackItem>
                  <h2>Card 2</h2>
                  <p>This is the second card in the stack</p>
                </ScrollStackItem>
                <ScrollStackItem>
                  <h2>Card 3</h2>
                  <p>This is the third card in the stack</p>
                </ScrollStackItem>
              </ScrollStack>
            </div>

            <div className="flex flex-col justify-center">
              <h3 className='text-2xl'>Con mas de 25 años de experiencia</h3>
              <p className=''>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Veritatis amet corporis tempora odit eum? Ad cum sapiente modi rem
                fuga delectus labore, hic, in enim vitae cumque nobis magnam quos
                totam, sunt aliquid facere culpa veniam optio laboriosam
                blanditiis. Facilis corporis dolorum nobis ipsam similique, maxime
                reiciendis quod accusantium libero laudantium, nulla eligendi
                architecto ullam debitis voluptatem itaque expedita culpa! Illum
                asperiores suscipit cupiditate numquam. Fuga tenetur et aliquam
                cum exercitationem, reiciendis consectetur quam ipsam sapiente
                labore autem voluptatum in sit expedita quae eaque rerum.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='max-w-7xl mx-auto py-15'>
        <h2 className='text-center'>Mas sobre nosotros</h2>
      </section>
    </>
  );
}
